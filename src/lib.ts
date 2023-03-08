import { AVAILABLE_NETWORKS, GOHM_NETWORK_ADDRESS } from './constants';
import { BigNumber, ethers } from 'ethers';
import ERC20Abi from './abi/ERC20TokenAbi.json';
import { getChainGasAndNonce } from './utils';

interface Configuration {
    abi: string;
    callContractAddress: string;
    network: AVAILABLE_NETWORKS;
    signer: ethers.Signer;
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
     * Calls the contract method set with the amount to allow in gOHM
     * @param amount The amount to allow as a string or number. (not gwei)
     * @param args Any other arguments the method may take
     * @param callMethodName The name of the method to be called if not 'pay'
     * @param setAllowance If true then it will call to set the allowance
     * @param autoGas If can set gas and nonce automatically
     * */
    async pay(
        amount: number | string,
        args: undefined | null | any,
        callMethodName = 'pay',
        setAllowance = true,
        autoGas = false
    ): Promise<any> {
        const isValidMethod = this.validateMethod(callMethodName, true);
        console.log(callMethodName);
        if (!isValidMethod) {
            throw new Error('The method set is not a valid contract method or is not payable');
        }

        const canSpendAmount = await this.hasAllowanceToSpend(Number(amount));

        if (!canSpendAmount && !setAllowance) {
            throw new Error('Allow the contract to spend that amount of gOHM. Call setAllowance()');
        }

        if (setAllowance && !canSpendAmount) {
            await (
                await this.setAllowance(Number(amount))
            ).wait();
        }
        let gasParams = {};
        if (autoGas) {
            const { gasPrice, nonce } = await getChainGasAndNonce(this.config.signer);
            gasParams = { gasPrice, nonce };
        }
        const paymentAmount = GohmPayment.formatToGwei(amount);
        if (args) {
            return this.contractToCall[callMethodName](paymentAmount, ...args, { ...gasParams });
        }
        return this.contractToCall[callMethodName](paymentAmount, { ...gasParams });
    }

    /**
     * Calls the contract method
     * @param callMethodName The method to call
     * @param callParams Your parameters
     * @param autoGas If True set gas and nonce
     * */
    async methodCall(callMethodName, callParams: any, autoGas = false): Promise<any> {
        const isValidMethod = this.validateMethod(callMethodName, false);
        if (!isValidMethod) {
            throw new Error('The method set is not a valid contract method or is not payable');
        }
        let gasParams = {};
        if (autoGas) {
            const { gasPrice, nonce } = await getChainGasAndNonce(this.config.signer);
            gasParams = { gasPrice, nonce };
        }
        return this.contractToCall[callMethodName](...callParams, { ...gasParams });
    }

    /**
     * Accepts an amount and sets the defined contract as allowance to spend
     * @param amount The amount of gOHM to allow the contract to spend
     * */
    async setAllowance(amount: number): Promise<{ wait: () => Promise<any> }> {
        const { callContractAddress, signer } = this.config;

        const { gasPrice, nonce } = await getChainGasAndNonce(signer);
        return await this.gohmCurrency
            .connect(this.config.signer)
            .approve(
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
        const signerAddress = await signer.getAddress();
        const allowance: BigNumber = await this.gohmCurrency.allowance(signerAddress, callContractAddress);
        const formattedAllowance = GohmPayment.formatToNumber(allowance);
        return formattedAllowance > amount;
    }

    /**
     * Accepts a regular number as the amount of gOHM to transform to gwei
     * @param amount The amount to format in gwei as a number or as string
     */
    static formatToGwei(amount: number | string): BigNumber {
        if (Number(amount) <= 0 || isNaN(Number(amount))) {
            throw Error('Cannot format numbers less than 0 or not numbers');
        }
        return ethers.utils.parseUnits(`${amount}`, GOHM_DECIMALS);
    }

    /**
     * Accepts a number of gOHM in gwei and makes it into a regular number.
     * It can be a bigint, number, string or a BigNumber
     * @param gwei Amount of gOHM in gwei
     */
    static formatToNumber(gwei: bigint | number | string | BigNumber): number {
        if (Number(gwei) < 0 || isNaN(Number(gwei))) {
            throw Error('Gwei can not be less than 0 or not a number');
        }
        return Number(ethers.utils.formatUnits(`${gwei}`, GOHM_DECIMALS));
    }

    /**
     * Utility method.
     * Checks the method requested is payable and exists within the contract
     * @param methodName The name of the method to validate
     * @param checkPayable Validate if the method is payable
     */
    validateMethod(methodName: string, checkPayable = true): boolean {
        const abiPayableFuncs = JSON.parse(this.config.abi)
            .filter(item => item.stateMutability == 'payable' && item.type == 'function');
        const contractContainsMethodName = Object
            .keys(this.contractToCall.functions)
            .find(key => key === methodName);
        if (!contractContainsMethodName) {
            throw new Error('Contract does not contain this method name.');
        }
        if (checkPayable) {
            const funcNames = abiPayableFuncs.map(item => item.name);
            if (!funcNames.includes(methodName)) {
                throw new Error('Abi does not contain this method name or it is not payable.');
            }
        }
        return true;
    }
}

export default GohmPayment;
