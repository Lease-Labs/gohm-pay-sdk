import { assert, expect } from 'chai';
import { approveTokenSpend, numToEth } from '../helpers/test-helpers';
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
        config = {
            abi: JSON.stringify(Payable),
            callContractAddress: payContract.address,
            callMethodName: 'depositWithParams',
            network: NETWORK['MATIC'],
            signer: caller,
            args: [5, gohmToken.address, 100]
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
            await approveTokenSpend(gohmToken, caller, payContract.address, numToEth(101));
            expect(await gohmPayment.hasAllowanceToSpend(99)).to.be.true;
            expect(await gohmPayment.hasAllowanceToSpend(101)).to.be.false;
        });
        it('To complete the payment', async () => {
            await gohmPayment.pay(100, true);
        });
    });
    describe('Throws', async () => {
        it('If spending is not approved and allowance is set to false', async () => {
            return gohmPayment.pay(100, false).catch(e => {
                assert.deepEqual(e, new Error('Allow the contract to spend that amount of gOHM. Call setAllowance()'));
            });
        });
        it('If method is not valid', async () => {
            gohmPayment.config = {
                abi: JSON.stringify(Payable),
                callContractAddress: payContract.address,
                callMethodName: 'randomMethodName',
                network: NETWORK['MATIC'],
                signer: caller,
                args: [5, gohmToken.address, 100]
            };
            return gohmPayment.pay(100).catch(e => {
                assert.deepEqual(e, new Error('Contract does not contain this method name.'));
            });
        });
        it('If method is not payable', async () => {
            gohmPayment.config = {
                abi: JSON.stringify(Payable),
                callContractAddress: payContract.address,
                callMethodName: 'deposit',
                network: NETWORK['MATIC'],
                signer: caller,
                args: []
            };
            return gohmPayment.pay(100, true).catch(e => {
                assert.deepEqual(e, new Error('Abi does not contain this method name or it is not payable.'));
            });
        });
    });
});