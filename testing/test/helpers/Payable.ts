import { ethers } from 'ethers';

const deposit = async (
    contract: ethers.Contract,
    signer: ethers.Signer
) => {
    const tx = await contract.connect(signer).deposit();
    return tx.wait();
};

const depositWithParams = async (
    contract: ethers.Contract,
    signer: ethers.Signer,
    someNumber: number,
    token:
) => {

}