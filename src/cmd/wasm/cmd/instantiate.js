import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

const message = Cosmos.message;

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

export const instantiate = async (argv) => {
  const { gas, source, codeId } = argv;

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);

  try {
    // next instantiate code
    const input = Buffer.from(argv.input).toString('base64');
    const txBody2 = getInstantiateMessage(codeId, input, sender, argv.label);
    const res = await cosmos.submit(childKey, txBody2, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), gas);

    console.log(res);
    const address = JSON.parse(res.tx_response.raw_log)[0].events[1].attributes[0].value;
    return address;
  } catch (error) {
    console.log('error: ', error);
  }
};

export default async (yargs: Argv) => {
  const { argv } = yargs

    .option('codeid', {
      describe: 'the code id of the smart contract',
      type: 'number'
    })
    .option('label', {
      describe: 'the label of smart contract',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    })
    .option('amount', {
      type: 'string'
    });

  await instantiate(argv);
};
