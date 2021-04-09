import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('address', {
      describe: 'the orai address',
      type: 'string',
      default: 'orai1u4jjn7adh46gmtnf2a9tsc2g9nm489d7nuhv8n'
    })
    .option('amount', {
      default: '1',
      type: 'string'
    });

  const message = Cosmos.message;
  const cosmos = new Cosmos(argv.url, argv.chainId);
  cosmos.setBech32MainPrefix('orai');
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const address = cosmos.getAddress(argv.mnemonic);
  console.log("address: ", address)

  const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
    from_address: cosmos.getAddress(childKey),
    to_address: argv.address,
    amount: [{ denom: cosmos.bech32MainPrefix, amount: argv.amount }] // 10
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmos.bank.v1beta1.MsgSend',
    value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: ''
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};
