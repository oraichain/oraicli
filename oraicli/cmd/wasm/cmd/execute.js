import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;
const message = Cosmos.message;

const getHandleMessage = (contract, msg, sender, amount) => {
  const sent_funds = [{ denom: cosmos.bech32MainPrefix, amount: "10" }];
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
  });

  const [address] = argv._.slice(-1);

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);
  let input = JSON.parse(argv.input);
  const msgBase64 = Buffer.from(JSON.stringify(input.mint_nft.msg)).toString('base64');
  input.mint_nft.msg = msgBase64;

  const txBody = getHandleMessage(address, Buffer.from(JSON.stringify(input)), sender, argv.amount);
  const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

  console.log(res);
};
