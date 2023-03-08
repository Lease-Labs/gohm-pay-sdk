import { assert, expect } from 'chai';
import { approveTokenSpend, numToEth } from '../helpers/test-helpers';
import { ethers } from 'hardhat';
import GohmPayment, { NETWORK } from '../../../src';
import Payable from '../../contracts/abi/Payable.json';

describe('Pay', () => {
    let payContract;
    let gohmToken;
    let caller;
    let config;
    let gohmPayment;
    let callMethodName;
    let randomSigner;
    beforeEach(async () => {
        [caller, randomSigner] = await ethers.getSigners();
        // Deploying smart contracts
        const GohmToken = await ethers.getContractFactory('FakeGohm');
        gohmToken = await GohmToken.deploy(0);
        await gohmToken.deployed();
        await gohmToken.mint(caller.address, numToEth(100));
        const PayContract = await ethers.getContractFactory('Payable');
        payContract = await PayContract.deploy();
        await payContract.deployed();
        await payContract.setGohmAddress(gohmToken.address);
        callMethodName = 'deposit';
        config = {
            abi: JSON.stringify(Payable),
            callContractAddress: payContract.address,
            network: NETWORK['MATIC'],
            signer: caller
        };
        gohmPayment = new GohmPayment(config);
        gohmPayment.gohmCurrency = gohmToken;
    });
    describe('Succeeds', async () => {
        it('Validating the method', async () => {
            const methodValidation = gohmPayment.validateMethod(callMethodName, true);
            expect(methodValidation).to.be.true;
        });
        it('Checking if user has enough allowance to spend', async () => {
            await approveTokenSpend(gohmToken, caller, payContract.address, numToEth(101));
            expect(await gohmPayment.hasAllowanceToSpend(101)).to.be.true;
            expect(await gohmPayment.hasAllowanceToSpend(102)).to.be.false;
        });

        describe('On Pay', () => {
            it('Completes the payment with no params', async () => {
                await gohmPayment.pay(100, undefined, 'deposit');
            });
            it('Completes the payment with params', async () => {
                await gohmPayment.pay(100, [5], 'depositWithParams');
            });
            it('Completes the payment with args', async () => {
                await gohmPayment.pay(100, [5, randomSigner.address], 'depositWithArgs');
            });
        });

    });

    describe('Throws', async () => {
        it('when spending is not approved and allowance is set to false', async () => {
            return gohmPayment.pay(100, undefined, callMethodName, false).catch(e => {
                assert.deepEqual(e, new Error('Allow the contract to spend that amount of gOHM. Call setAllowance()'));
            });
        });
        it('When method is not valid', async () => {
            gohmPayment.config = {
                abi: JSON.stringify(Payable),
                callContractAddress: payContract.address,
                network: NETWORK['MATIC'],
                signer: caller,
            };
            return gohmPayment.pay(100, undefined, 'doesNotExist').catch(e => {
                assert.deepEqual(e, new Error('Contract does not contain this method name.'));
            });
        });
        it('When method is not payable', async () => {
            gohmPayment.config = {
                abi: JSON.stringify(Payable),
                callContractAddress: payContract.address,
                network: NETWORK['MATIC'],
                signer: caller,
            };
            return gohmPayment.pay(100, undefined, callMethodName, true).catch(e => {
                assert.deepEqual(e, new Error('Abi does not contain this method name or it is not payable.'));
            });
        });
    });
});