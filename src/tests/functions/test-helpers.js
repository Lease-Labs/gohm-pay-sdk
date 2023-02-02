const { ethers } = require('ethers');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 *
 * GENERAL UTILS FUNCTIONS
 *
 */
const numToBigNum = num => {
    return ethers.BigNumber.from(num.toString());
};

const numToEth = num => {
    return ethers.utils.parseEther(num.toString());
};

const ethToNum = eth => {
    return Number(ethers.utils.formatEther(eth));
};

const approveTokenSpend = async (tokenContract, signer, contractApproveAddress, amount) => {
    await tokenContract
        .connect(signer)
        .approve(contractApproveAddress, numToBigNum(amount));
};

const getTokenBalance = async (tokenContract, address) => {
    return await tokenContract.balanceOf(address);
};

exports.ZERO_ADDRESS = ZERO_ADDRESS;
exports.numToEth = numToEth;
exports.numToBigNum = numToBigNum;
exports.ethToNum = ethToNum;
exports.approveTokenSpend = approveTokenSpend;
exports.getTokenBalance = getTokenBalance;
