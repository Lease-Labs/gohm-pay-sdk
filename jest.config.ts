import * as dotenv from 'dotenv';
import { resolve } from 'path';

const path = resolve(__dirname, './.env');
dotenv.config({ path });

export default {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,
  modulePathIgnorePatterns: ['dist'],
};
