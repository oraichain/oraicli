import { Argv } from 'yargs';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { stringToPath } from '@cosmjs/crypto';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { Decimal } from '@cosmjs/math';
import { GasPrice } from '@cosmjs/stargate';
import fs from 'fs';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('address', {
      describe: 'the smart contract address',
      type: 'string'
    })
    .option('amount', {
      type: 'string'
    })
    .option('memo', {
      type: 'string'
    });
  const [address] = argv._.slice(-1);
  const prefix = process.env.PREFIX || 'orai';
  const denom = process.env.DENOM || 'orai';
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
    prefix
  });
  const [firstAccount] = await wallet.getAccounts();

  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL, wallet, {
    gasPrice: new GasPrice(Decimal.fromUserInput('0', 6), denom),
    prefix
  });
  const input = JSON.parse(argv.input);
  const amount = [{ amount: argv.amount, denom }];
  const result = await client.execute(firstAccount.address, address, input, 'auto', argv.memo, amount);
  console.log('result: ', result);
};
