import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;
const message = Cosmos.message;

const getHandleMessage = (contract, msg, sender, amount) => {
  const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
    contract,
    msg,
    sender,
    sent_funds
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
    value: message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('address', {
    describe: 'the smart contract address',
    type: 'string'
  }).option('amount', {
    type: 'string'
  }).option('msg', {
    type: 'string'
  });

  const [address] = argv._.slice(-1);

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);
  let input = JSON.parse(argv.input);
  const outerKey = Object.keys(input)[0];
  let innerObj = input[outerKey];
  if ("msg" in innerObj) {
    const msgBase64 = Buffer.from(JSON.stringify(innerObj.msg)).toString('base64');
    innerObj.msg = msgBase64;
    input[outerKey] = innerObj;
  }

  const txBody = getHandleMessage(address, Buffer.from(JSON.stringify(input)), sender, argv.amount);
  const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

  console.log(res);
};
