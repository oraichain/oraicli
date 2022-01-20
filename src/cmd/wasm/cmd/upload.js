import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

const message = Cosmos.message;

const getStoreMessage = (wasm_byte_code, sender, source) => {
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
    wasm_byte_code,
    sender,
    source
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgStoreCode',
    value: message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

export const upload = async (argv) => {
  const [file] = argv._.slice(-1);

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);
  const { gas, source } = argv;

  const wasmBody = fs.readFileSync(file).toString('base64');

  const txBody1 = getStoreMessage(wasmBody, sender, source ? fs.readFileSync(source).toString() : '');

  try {
    // console.log('argv fees: ', argv);
    const res = await cosmos.submit(childKey, txBody1, 'BROADCAST_MODE_BLOCK', !argv.fees ? null : [{ denom: 'orai', amount: argv.fees }], gas);
    // console.log('res: ', res);
    console.log('res: ', res);
    const codeId = res.tx_response.logs[0].events[0].attributes.find((attr) => attr.key === 'code_id').value;
    return codeId;
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
