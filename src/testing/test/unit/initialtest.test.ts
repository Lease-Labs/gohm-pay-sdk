import GohmPayment from '../../../lib';
import { ethers } from 'ethers';
import Marketplace from '../abi/ContractAbi.json';
import { NETWORK } from '../../../constants';

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
    }
);

describe('Initial unit tests', () => {
    test('Should return true if method name is validated', async () => {
        const hasAllowance = await payment.hasAllowanceToSpend(10);
        expect(hasAllowance).toReturn();
    }),
    test('Should return true if method name is validated', async () => {
        const validated = await payment.validateMethod();
        expect(validated).toBe(true);
    }),
    test('Should return callable method argument name and types', async () => {
        const methodArgs = payment.returnMethodArgs();
        expect(methodArgs).toBeTruthy();
    })
});