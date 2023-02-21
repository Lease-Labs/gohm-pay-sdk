import { ethers } from 'ethers';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const numToBigNum = num => {
    return ethers.BigNumber.from(num.toString());
};

export const numToEth = num => {
    return ethers.utils.parseEther(num.toString());
};

export const ethToNum = eth => {
    return Number(ethers.utils.formatEther(eth));
};

export const approveTokenSpend = async (tokenContract, signer, contractApproveAddress, amount) => {
    await tokenContract
        .connect(signer)
        .approve(contractApproveAddress, numToBigNum(amount));
};

export const getTokenBalance = async (tokenContract, address) => {
    return await tokenContract.balanceOf(address);
};
