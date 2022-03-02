import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

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
  const [to_address] = argv._.slice(-1);

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const address = cosmos.getAddress(childKey);
  console.log('from: ', address);

  const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
    from_address: cosmos.getAddress(childKey),
    to_address,
    amount: [{ denom: cosmos.bech32MainPrefix, amount: argv.amount }] // 10
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmos.bank.v1beta1.MsgSend',
    value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish(),
    value_raw: msgSend
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: argv.memo
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), 'auto');
    // const response = await cosmos.simulate(childKey.publicKey, txBody);
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};
