import { AVAILABLE_NETWORKS, GOHM_NETWORK_ADDRESS } from './constants';
import { BigNumber, ethers } from 'ethers';
import ERC20Abi from './abi/ERC20TokenAbi.json';
import { getChainGasAndNonce } from './utils';

interface Configuration {
    abi: string;
    callContractAddress: string;
    callMethodName: string; // TODO validate this is a payable method. Validate this exists on the abi
    network: AVAILABLE_NETWORKS,
    signer: ethers.Signer // TODO I think we will just need the signer here not the provider
}

const GOHM_DECIMALS = 18;

class GohmPayment {
    config: Configuration;
    contractToCall: ethers.Contract;
    gohmCurrency: ethers.Contract;

    constructor(config: Configuration) {
        const { callContractAddress, abi, signer, network } = config;
        this.config = config;
        this.contractToCall = new ethers.Contract(callContractAddress, abi, signer);
        this.gohmCurrency = new ethers.Contract(
            GOHM_NETWORK_ADDRESS[network],
            JSON.stringify(ERC20Abi),
            signer
        );
    }

    /**
     * Calls the contract method set with the amount to spend in Gohm
     * @param amount The amount to pay as a string or number. (not gwei)
     * @param setAllowance If true then it will call to set the allowance
     */
    async pay(amount: number | string, setAllowance = true): Promise<any> {
        const { callMethodName } = this.config;
        const isValidMethod = this.validateMethod();
        if (!isValidMethod) {
            throw new Error('The method set is not a valid contract method or is not payable');
        }

        const paymentAmount = GohmPayment.formatToGwei(amount);
        const canSpendAmount = await this.hasAllowanceToSpend(Number(amount));

        if (!canSpendAmount && !setAllowance) {
            throw new Error('Allow the contract to spend that amount of gOHM. Call setAllowance()');
        }

        if (setAllowance && !canSpendAmount) {
            await (
                await this.setAllowance(Number(amount))
            ).wait();
        }

        return this.contractToCall[callMethodName].arguments(paymentAmount);
    }

    /**
     * Accepts an amount and sets the defined contract as allowance to spend
     * @param amount The amount of gOHM to allow the contract to spend
     * */
    async setAllowance(amount: number): Promise<{ wait: () => Promise<any> }> {
        const { callContractAddress, signer } = this.config;

        const { gasPrice, nonce } = await getChainGasAndNonce(signer);
        return await this.gohmCurrency.approve(
            callContractAddress,
            GohmPayment.formatToGwei(amount),
            { gasPrice, nonce }
        );
    }

    /**
     * Receives an amount and checks if the contract defined can spend that amount
     * @param amount The amount to check if the contract can spend in gOHM
     */
    async hasAllowanceToSpend(amount: number): Promise<boolean> {
        const { callContractAddress, signer } = this.config;

        const allowance: BigNumber = await this.gohmCurrency.allowance(signer.getAddress(), callContractAddress);
        const formattedAllowance = GohmPayment.formatToNumber(allowance);
        return formattedAllowance > amount;
    }

    /**
     * Accepts a regular number as the amount of gOHM to transform to gwei
     * @param amount The amount to format in gwei as a number or as string
     */
    static formatToGwei(amount: number | string): BigNumber {
        if (amount <= 0) {
            throw Error('Cannot format numbers less than 0');
        }
        return ethers.utils.parseUnits(`${amount}`, GOHM_DECIMALS);
    }

    /**
     * Accepts a number of gOHM in gwei and makes it into a regular number.
     * It can be a bigint, number, string or a BigNumber
     * @param gwei Amount of gOHM in gwei
     */
    static formatToNumber(gwei: bigint | number | string | BigNumber): number {
        if (gwei <= 0) {
            throw Error('Gwei can not be less than 0');
        }
        return Number(ethers.utils.formatUnits(`${gwei}`, GOHM_DECIMALS));
    }

    /**
     * Utility method.
     * Checks the method requested is payable and exists within the contract
     */
    validateMethod (): boolean {
        const abiPayableFuncs = JSON.parse(this.config.abi)
            .filter(item => item.stateMutability == 'payable' && item.type == 'function');
        const contractContainsMethodName = Object
            .keys(this.contractToCall.functions)
            .find(key => key === this.config.callMethodName);
        if (!contractContainsMethodName) {
            throw new Error('Contract does not contain this method name.');
        }
        const funcNames = abiPayableFuncs.map(item => item.name);
        if (!funcNames.includes(this.config.callMethodName)) {
            throw new Error('Abi does not contain this method name or it is not payable.');
        }
        return true;
    }

    /**
     * Utility method.
     * Returns all the methods of the contract provided
     */
    returnMethodArgs (): any {
        const contractFun = JSON.parse(this.config.abi).find(item => item.name == this.config.callMethodName);
        return contractFun.inputs.map(inp => {
            return {
                name: inp.name,
                type: inp.type
            };
        });
    }
}

export default GohmPayment;
