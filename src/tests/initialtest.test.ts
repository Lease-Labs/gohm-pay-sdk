import GohmPayment from '../lib';
import { ethers } from 'ethers';
import Marketplace from './abi/Marketplace.json';
import { NETWORK } from '../constants';


describe('Initial unit tests', () => {
    test('should return true ', async () => {
        const isGreaterThan: boolean = 2 > 1;
        expect(isGreaterThan).toBe(true);
    }),
    test('Should return true if method name is validated', async () => {
        const wallet: ethers.Wallet = ethers.Wallet.createRandom();
        const connection = new ethers.providers.JsonRpcBatchProvider('https://polygon-mumbai.g.alchemy.com/v2/Ici0r6bnKxal-kVQFeuHxOhGukpWH8f_');
        const signer = wallet.connect(connection);
        const payment = new GohmPayment(
            {
                callContractAddress: '0xED3a5dE5Bc0a6f06259D4dBBc8E7595D2EDAe6eE',
                abi: JSON.stringify(Marketplace),
                callMethodName: 'requestListing',
                signer: signer,
                network: NETWORK.MATIC,
            })
        const validated = await payment.validateMethod();
        expect(validated).toBe(true);
    }),
    test('Should return true if method name is validated', async () => {
        const wallet: ethers.Wallet = ethers.Wallet.createRandom();
        const connection = new ethers.providers.JsonRpcBatchProvider('https://polygon-mumbai.g.alchemy.com/v2/Ici0r6bnKxal-kVQFeuHxOhGukpWH8f_');
        const signer = wallet.connect(connection);
        const payment = new GohmPayment(
            {
                callContractAddress: '0xED3a5dE5Bc0a6f06259D4dBBc8E7595D2EDAe6eE',
                abi: JSON.stringify(Marketplace),
                callMethodName: 'requestListing',
                signer: signer,
                network: NETWORK.MATIC,
            })
        const methodArgs = payment.returnMethodArgs();
        console.log(methodArgs);
        expect(methodArgs).toBeTruthy();
    })
});