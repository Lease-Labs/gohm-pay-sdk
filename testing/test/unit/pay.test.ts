import GohmPayment from '../../../src';
import { BigNumber } from 'ethers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { numToEth } from '../helpers/test-helpers';

describe('Utility methods', () => {
    let payContract;
    let gohmToken;
    let contractOwner;
    let caller;
    beforeEach(async () => {
        [
            contractOwner,
            caller,
        ] = await ethers.getSigners();

        const GohmToken = await ethers.getContractFactory('GohmToken');
        gohmToken = await GohmToken.deploy(0);
        await gohmToken.deployed();
        await gohmToken.mint(caller.address, numToEth(100));

        const PayContract = await ethers.getContractFactory('Payable');
        payContract = await PayContract.deploy();
        await payContract.deployed();
    });
    describe('pay', () => {
        expect(true).to.equal(true)
    });
});