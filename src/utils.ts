import { BigNumber, ethers } from 'ethers';

export const calculateGasPrice = async (signerOrProvider: ethers.Signer): Promise<BigNumber> => {
    const currentGasPrice = await signerOrProvider.getGasPrice();
    return currentGasPrice.add(currentGasPrice.div(5));
};

interface ChainData {
    gasPrice: BigNumber;
    nonce: number;
}

export const getChainGasAndNonce = async (signer: ethers.Signer): Promise<ChainData> => {
    const gasPrice = await calculateGasPrice(signer);
    const nonce = await signer.getTransactionCount('latest');
    return { gasPrice, nonce };
};