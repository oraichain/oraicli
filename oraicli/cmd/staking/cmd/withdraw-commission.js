import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs;

  const message = Cosmos.message;
  const sender = cosmos.getAddress(argv.mnemonic);
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const { amount, address } = argv;
  const msgWithdrawValidtorCommission = new message.cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission({
    validator_address: address,
  });

  console.log('msg delegate: ', msgWithdrawValidtorCommission);

  const msgWithdrawValidtorCommissionAny = new message.google.protobuf.Any({
    type_url: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    value: message.cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission.encode(msgWithdrawValidtorCommission).finish(),
    value_raw: msgWithdrawValidtorCommission,
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgWithdrawValidtorCommissionAny],
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), 20000000);
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};

// yarn oraicli staking withdraw-commission --address oraivaloper18hr8jggl3xnrutfujy2jwpeu0l76azprkxn29v --chain-id Oraichain-testnet
