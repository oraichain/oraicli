import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs;

  const message = Cosmos.message;
  const sender = cosmos.getAddress(argv.mnemonic);
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const delegator = cosmos.getAddress(argv.mnemonic);
  const { address, amount } = argv;
  const msg = new message.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward({
    delegator_address: delegator,
    validator_address: address
  });

  console.log('msg withdraw: ', msg);

  const msgAny = new message.google.protobuf.Any({
    type_url: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    value: message.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward.encode(msg).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgAny],
    memo: ''
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};

// yarn oraicli staking delegate --address oraivaloper1x6xl5kls4xkmkv3rst5tndmxtqt0u8dx7e4hn0 --amount 1 --chain-id private-Oraichain
