import GohmPayment from '../../../src';
import { BigNumber } from 'ethers';
import { expect } from 'chai';

describe('Utility methods', () => {
    describe('formatToGwei', () => {
        it('Formats with a number', () => {
            expect(GohmPayment.formatToGwei(1)).to.eq(BigNumber.from(`${10 ** 18}`));
        });
        it('Formats with a string', () => {
            expect(GohmPayment.formatToGwei('1')).to.eq(BigNumber.from(`${10 ** 18}`));
        });
        it('Throws when number is less than 0', () => {
            expect(function (){
                GohmPayment.formatToGwei(-123);
            }).to.throw('Cannot format numbers less than 0 or not numbers');
        });
        it('Throws when string is not a number', () => {
            expect(function (){
                GohmPayment.formatToGwei('adsas');
            }).to.throw('Cannot format numbers less than 0 or not numbers');
        });
    });

    describe('formatToNumber', () => {
        it('Formats with a number', () => {
            expect(GohmPayment.formatToNumber(2 * 10 ** 18)).to.eq(2);
        });
        it('Formats with a string', () => {
            expect(GohmPayment.formatToNumber(`${2 * 10 ** 18}`)).to.eq(2);
        });
        it('Formats with a BigNumber', () => {
            expect(GohmPayment.formatToNumber(BigNumber.from(`${2 * 10 ** 18}`))).to.eq(2);
        });
        it('Throws when number is less than 0', () => {
            expect(function (){
                GohmPayment.formatToNumber(-123);
            }).to.throw('Gwei can not be less than 0 or not a number');
        });
        it('Throws when string is not a number', () => {
            expect(function (){
                GohmPayment.formatToNumber('adsas');
            }).to.throw('Gwei can not be less than 0 or not a number');
        });
    });
});