import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';

export default async (yargs: Argv) => {
  const { argv } = yargs.option('amount', {
    describe: 'the undelegated amount',
    default: '0',
    type: 'string'
  }).option('address', {
    describe: "validator address",
    default: "0",
    type: "string"
  });

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const delegator = cosmos.getAddress(argv.mnemonic);
  const msgDelegate = new message.cosmos.staking.v1beta1.MsgUndelegate({
    delegator_address: delegator,
    validator_address: argv.address,
    amount: { denom: cosmos.bech32MainPrefix, amount: argv.amount }
  });

  const msgDelegateAny = new message.google.protobuf.Any({
    type_url: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: message.cosmos.staking.v1beta1.MsgUndelegate.encode(msgDelegate).finish()
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

// yarn oraicli staking undelegate --address oraivaloper1h9gg3xavqdau6uy3r36vn4juvzsg0lqvszgtvc --amount 7661709874
