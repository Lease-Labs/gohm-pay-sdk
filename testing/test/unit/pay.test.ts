import { expect } from 'chai';
import { approveTokenSpend, ethToNum, numToEth } from '../helpers/test-helpers';
import { ethers } from 'hardhat';
import GohmPayment, { NETWORK } from '../../../src';
import Payable from '../../contracts/abi/Payable.json';

describe('Pay', () => {
    let payContract;
    let gohmToken;
    let contractOwner;
    let caller;
    let config;
    let gohmPayment;
    beforeEach(async () => {
        [
            contractOwner,
            caller,
        ] = await ethers.getSigners();
        const GohmToken = await ethers.getContractFactory('FakeGohm');
        gohmToken = await GohmToken.deploy(0);
        await gohmToken.deployed();
        await gohmToken.mint(caller.address, numToEth(100));
        const PayContract = await ethers.getContractFactory('Payable');
        payContract = await PayContract.deploy();
        await payContract.deployed();
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        await approveTokenSpend(gohmToken, caller, payContract.address, numToEth(101));
        config = {
            abi: JSON.stringify(Payable),
            callContractAddress: payContract.address,
            callMethodName: 'depositWithParams',
            network: NETWORK['MATIC'],
            signer: caller,
            args: [5, gohmToken, 100]
        };
        gohmPayment = new GohmPayment(config);
        gohmPayment.gohmCurrency = gohmToken;
    });
    describe('Succeeds', async () => {
        it('To fetch the method arguments', async () => {
            const methodArgs = await gohmPayment.returnMethodArgs();
            expect(methodArgs).to.deep.equal([
                { name: 'someRandomVar', type: 'uint256' },
                { name: 'token', type: 'address' },
                { name: 'amount', type: 'uint256' }
            ]
            );
        });
        it('To validate the method', async () => {
            const methodValidation = gohmPayment.validateMethod();
            expect(methodValidation).to.be.true;
        });
        it('To check if user has enough allowance to spend', async () => {
            expect(await gohmPayment.hasAllowanceToSpend(99)).to.be.true;
            expect(await gohmPayment.hasAllowanceToSpend(101)).to.be.false;
        });
        it('To complete the payment', async () => {
            await gohmPayment.pay(99, false);
        });
    });
});