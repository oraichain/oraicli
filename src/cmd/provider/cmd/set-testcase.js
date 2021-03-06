import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('name', {
      describe: 'the testcase name',
      type: 'string'
    })
    .positional('contract', {
      describe: 'the testcase contract address',
      type: 'string'
    })
    .positional('description', {
      describe: 'the testcase description',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    });

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);

  const [name, description, contractAddress] = argv._.slice(-3);
  const { fees } = argv;
  // get accAddress in binary
  const accAddress = bech32.fromWords(bech32.toWords(childKey.identifier));
  const msgSend = new message.oraichain.orai.provider.MsgCreateTestCase({
    name,
    description,
    contract: contractAddress,
    owner: accAddress,
    fees: fees === '' ? '0orai' : fees
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/oraichain.orai.provider.MsgCreateTestCase',
    value: message.oraichain.orai.provider.MsgCreateTestCase.encode(msgSend).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: 'set-testcase'
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};
