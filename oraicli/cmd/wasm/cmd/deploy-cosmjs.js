import { Argv } from 'yargs';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { Decimal } from "@cosmjs/math";
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
    .option('source', {
      describe: 'the source code of the smart contract',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    }).option('amount', {
      type: 'string'
    });
  const [to_address] = argv._.slice(-1);
  const [file] = argv._.slice(-1);
  const prefix = process.env.PREFIX || "orai";
  const denom = process.env.DENOM || "orai";
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    argv.mnemonic,
    {
      hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
      prefix
    }
  );
  const [firstAccount] = await wallet.getAccounts();
  console.log("first account: ", firstAccount);
  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL || "https://testnet-rpc.orai.io", wallet, { gasPrice: new GasPrice(Decimal.fromUserInput("0", 6), denom), prefix });
  const wasmBody = fs.readFileSync(file);

  update smart contract to collect code id
  const uploadResult = await client.upload(firstAccount.address, wasmBody, { source: "" }, "demo upload contract");
  console.log("upload result: ", uploadResult);

  const codeId = uploadResult.codeId;
  const input = JSON.parse(argv.input);

  const instantiateResult = await client.instantiate(firstAccount.address, parseInt(codeId), input, "demo contract");
  console.log("instantiate result: ", instantiateResult);
};
