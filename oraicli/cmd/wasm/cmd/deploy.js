import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

const message = Cosmos.message;

const getStoreMessage = (wasm_byte_code, sender, source) => {
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
    wasm_byte_code,
    sender,
    source: source ? source : ""
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgStoreCode',
    value: message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

const getInstantiateMessage = (code_id, init_msg, sender, label = '', amount = '') => {
  const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgInstantiateContract({
    code_id,
    init_msg,
    label,
    sender,
    sent_funds
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgInstantiateContract',
    value: message.cosmwasm.wasm.v1beta1.MsgInstantiateContract.encode(msgSend).finish()
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

  const [file] = argv._.slice(-1);

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);
  const { gas, source } = argv;

  const wasmBody = fs.readFileSync(file).toString('base64');

  const txBody1 = getStoreMessage(wasmBody, sender, source);

  try {
    // console.log('argv fees: ', argv);
    const res1 = await cosmos.submit(childKey, txBody1, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), gas);
    // console.log('res1: ', res1);
    if (res1.tx_response.code !== 0) {
      console.log('response: ', res1);
    }
    console.log('res1: ', res1);

    // next instantiate code
    const codeId = res1.tx_response.logs[0].events[0].attributes.find((attr) => attr.key === 'code_id').value;
    const input = Buffer.from(argv.input).toString('base64');
    const txBody2 = getInstantiateMessage(codeId, input, sender, argv.label);
    const res2 = await cosmos.submit(childKey, txBody2, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), gas);

    console.log(res2);
    let address = JSON.parse(res2.tx_response.raw_log)[0].events[1].attributes[0].value;
    console.log('contract address: ', address);
  } catch (error) {
    console.log("error: ", error);
  }
  // fs.writeFileSync('./address.txt', address);
};

// yarn oraicli wasm deploy ../oraiwasm/smart-contracts/classification/artifacts/classification.wasm --label "classification 14" --input '{}'
