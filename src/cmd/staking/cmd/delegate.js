import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';

export default async (yargs: Argv) => {
  const { argv } = yargs.option('amount', {
    describe: 'the delegated amount',
    default: '0',
    type: 'string'
  });

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const delegator = cosmos.getAddress(argv.mnemonic);
  const { address, amount } = argv;
  let amountParam;
  // if not set amount then delegate available balance, amount is uorai
  if (!parseInt(amount)) {
    const { balances } = await cosmos.get(`/cosmos/bank/v1beta1/balances/${delegator}`);
    amountParam = balances[0];
  } else {
    amountParam = { denom: cosmos.bech32MainPrefix, amount: amount.toString() };
  }
  const msgDelegate = new message.cosmos.staking.v1beta1.MsgDelegate({
    delegator_address: delegator,
    validator_address: address,
    amount: amountParam
  });

  console.log('msg delegate: ', msgDelegate);

  const msgDelegateAny = new message.google.protobuf.Any({
    type_url: '/cosmos.staking.v1beta1.MsgDelegate',
    value: message.cosmos.staking.v1beta1.MsgDelegate.encode(msgDelegate).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgDelegateAny],
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
