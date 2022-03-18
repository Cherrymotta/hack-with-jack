import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, './.env') })

import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

const provider = new HDWalletProvider(
  {
    mnemonic: {
      phrase: process.env.MNEMONIC,
    },
    providerOrUrl: process.env.RPC_ENDPOINT,
    numberOfAddresses: 100,
  }
);
const web3 = new Web3(provider);

export {deploy, web3, provider};