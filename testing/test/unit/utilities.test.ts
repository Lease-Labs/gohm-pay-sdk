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
    });
});