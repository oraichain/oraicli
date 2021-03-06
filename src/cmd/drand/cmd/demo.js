import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

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
  const { argv } = yargs
    .positional('address', {
      describe: 'the smart contract address',
      type: 'string'
    })
    .option('round', {
      describe: 'round of the randomness to query',
      type: 'number',
      default: 1
    })
    .option('user_input', {
      describe: 'unique user input',
      type: 'string',
      default: ''
    })
    .option('amount', {
      describe: 'fees to update the vrf round',
      type: 'string',
      default: '1'
    });

  const [address] = argv._.slice(-1);

  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);

  // invoke handle message contract to update the randomness value. Min fees is 1orai
  const input = Buffer.from(
    JSON.stringify({
      request_random: {
        input: Buffer.from('hello world').toString('base64')
      }
    })
  );

  const txBody = getHandleMessage(address, input, sender, argv.amount);
  try {
    const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
    console.log(res);
  } catch (error) {
    console.log('error: ', error);
  }

  // query latest random round
  const queryLatestInput = JSON.stringify({
    latest_round: {}
  });
  const latest = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(queryLatestInput).toString('base64')}`);
  console.log('latest round: ', latest);

  // query current fees required
  const queryConfig = JSON.stringify({
    contract_info: {}
  });
  const fees = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(queryConfig).toString('base64')}`);
  console.log('current contract info: ', fees);

  // query a specific round information
  let round = argv.round ? argv.round : 1;
  const queryRoundInput = JSON.stringify({
    get_round: { round }
  });
  const roundOutput = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(queryRoundInput).toString('base64')}`);
  console.log(`round ${round} information: `, roundOutput);
};
