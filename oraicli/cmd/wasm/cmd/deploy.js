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

const getInstantiateMessage = (code_id, init_msg, sender, label = '', amount = '') => {
  const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgInstantiateContract({
    code_id,
    init_msg,
    label,
    sender,
    init_funds: sent_funds,
    admin: sender,
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgInstantiateContract',
    value: message.cosmwasm.wasm.v1beta1.MsgInstantiateContract.encode(msgSend).finish(),
    value_raw: { ...msgSend, init_msg: JSON.parse(msgSend.init_msg.toString('ascii')) },
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
    const res1 = await cosmos.submit(childKey, txBody1, 'BROADCAST_MODE_BLOCK', 0.0025, 5000000);
    // const res1 = await cosmos.simulate(childKey.publicKey, txBody1);
    console.log('res1: ', res1);
    if (res1.tx_response.code !== 0) {
      console.log('response: ', res1);
    }

    // next instantiate code
    const codeId = res1.tx_response.logs[0].events[0].attributes.find((attr) => attr.key === 'code_id').value;
    const input = Buffer.from(argv.input);
    const txBody2 = getInstantiateMessage(codeId, input, sender, argv.label);
    const res2 = await cosmos.submit(childKey, txBody2, 'BROADCAST_MODE_BLOCK', 0.0025, 5000000);

    console.log(res2);
    let address = JSON.parse(res2.tx_response.raw_log)[0].events[1].attributes[0].value;
    console.log('contract address: ', address);
  } catch (error) {
    console.log("error: ", error);
  }
  // fs.writeFileSync('./address.txt', address);
};

// yarn oraicli wasm deploy ../oraiwasm/package/plus/ow1155/artifacts/ow1155.wasm --label "classification 14" --input '{"minter":"orai18hr8jggl3xnrutfujy2jwpeu0l76azprlvgrwt"}'
