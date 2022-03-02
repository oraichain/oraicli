import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

const message = Cosmos.message;

const getStoreMessage = (wasm_byte_code, sender, source) => {
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
    wasm_byte_code,
    sender,
    source: source ? source : "",
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgStoreCode',
    value: message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish(),
    value_raw: msgSend,
  });

  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
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
    }).option('amount', {
      type: 'string'
    });

  const [file] = argv._.slice(-1);

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);
  const { gas, source } = argv;

  const wasmBody = fs.readFileSync(file).toString('base64');

  const txBody1 = getStoreMessage(wasmBody, sender, source);

  try {
    // console.log('argv fees: ', argv);
    const res1 = await cosmos.submit(childKey, txBody1, 'BROADCAST_MODE_BLOCK', 0.0025, 5000000);
    // const res1 = await cosmos.simulate(childKey.publicKey, txBody1);
    console.log('res1: ', res1);
    if (res1.tx_response.code !== 0) {
      console.log('response: ', res1);
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

// yarn oraicli wasm upload ../oraiwasm/package/plus/ow1155/artifacts/ow1155.wasm
