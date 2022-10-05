import { Argv } from 'yargs';
import fs from 'fs';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';

export const upload = async (argv) => {
  const [file] = argv._.slice(-1);

  const { gas, source } = argv;

  const wasmBody = fs.readFileSync(file);

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
    prefix
  });
  const [firstAccount] = await wallet.getAccounts();
  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL || 'https://testnet-rpc.orai.io', wallet, {
    gasPrice: new GasPrice(Decimal.fromUserInput('0', 6), denom),
    prefix
  });

  try {
    // console.log('argv fees: ', argv);
    let res = await client.upload(firstAccount.address, wasmBody);
    return res.codeId;
  } catch (error) {
    console.log('error: ', error);
  }
};

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('file', {
      describe: 'the smart contract file',
      type: 'string'
    })
    .option('source', {
      describe: 'the source code of the smart contract',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    });

  await upload(argv);
};
