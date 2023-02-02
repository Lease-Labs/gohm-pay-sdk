/* eslint-disable no-unused-vars */
import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@openzeppelin/hardhat-upgrades';

dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
      POLYSCAN_API_KEY: string;
      MUMBAI_URL: string;
      ENV: 'local';
      API_KEY: string;
    }
  }
}

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.4',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            forking: {
                url: process.env.MUMBAI_URL || '',
            },
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: 'USD',
    },
    etherscan: {
        apiKey: process.env.POLYSCAN_API_KEY,
    },
    typechain: {
        target: 'ethers-v5',
    },
    paths: {
        sources: './testing/contracts',
        tests: './testing/test'
    }
};

export default config;
