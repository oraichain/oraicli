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
    .positional('file', {
      describe: 'the smart contract file',
      type: 'string'
    })
    .option('label', {
      describe: 'the label of smart contract',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    })
    .option('input', {
      'description': 'input',
      type: 'string'
    })
    .option('amount', {
      type: 'string'
    });
  const [file] = argv._.slice(-1);
  const prefix = process.env.PREFIX || 'orai';
  const denom = process.env.DENOM || 'orai';
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
    prefix
  });
  const [firstAccount] = await wallet.getAccounts();

  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL, wallet, {
    gasPrice: GasPrice.fromString(`${process.env.GAS_PRICES}${prefix}`),
    prefix
  });
  const wasmBody = fs.readFileSync(file);

  // update smart contract to collect code id
  const uploadResult = await client.upload(firstAccount.address, wasmBody, 'auto');
  console.log('upload result: ', uploadResult);

  const codeId = uploadResult.codeId;
  const input = JSON.parse(argv.input);

  const instantiateResult = await client.instantiate(firstAccount.address, parseInt(codeId), input, argv.label, 'auto', { admin: argv.admin });
  console.log('instantiate result: ', instantiateResult);
};

// receiver: orai14z590qwj05j0xa5gqalmtm5t9q2avxh0x2c4qv08498dceam0gasssxfah
// sender: orai1yymkhwl3046xra7d89mwras79f50st35j7ea5qux4yc5lysdcx0q07j3uw