import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('oldName', {
      describe: 'the old testcase name',
      type: 'string'
    })
    .positional('newName', {
      describe: 'the new testcase name',
      type: 'string'
    })
    .positional('description', {
      describe: 'the testcase description',
      type: 'string'
    })
    .positional('contract', {
      describe: 'the testcase contract address',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    });

  const message = Cosmos.message;

  const childKey = cosmos.getChildKey(argv.mnemonic);

  const [oldName, newName, description, contractAddress] = argv._.slice(-4);
  const { fees } = argv;
  // get accAddress in binary
  const accAddress = bech32.fromWords(bech32.toWords(childKey.identifier));
  const msgSend = new message.oraichain.orai.provider.MsgEditTestCase({
    old_name: oldName,
    new_name: newName,
    description: description,
    contract: contractAddress,
    owner: accAddress,
    fees: fees === '' ? '0orai' : fees
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/oraichain.orai.provider.MsgEditTestCase',
    value: message.oraichain.orai.provider.MsgEditTestCase.encode(msgSend).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: 'edit-testcase'
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};

// yarn oraicli provider edit-testcase classification classification "test edit test case" orai1myee9usysamhfv5nffjs6vvv3zfn2kuy8xamhx
