import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('address', {
      describe: 'the recipient address',
      type: 'string'
    })
    .option('amount', {
      default: '1',
      type: 'string'
    })
    .option('timeout', {
      default: 60,
      type: 'number'
    })
    .option('port', {
      default: 'transfer',
      type: 'string'
    })
    .option('channel', {
      default: 'channel-0',
      type: 'string'
    });

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const sender = cosmos.getAddress(childKey);

  const address = argv._.length > 2 ? argv._.slice(-1)[0] : sender;

  const msgSend = new message.ibc.applications.transfer.v1.MsgTransfer({
    source_channel: argv.channel,
    source_port: argv.port,
    sender,
    receiver: address,
    token: { denom: cosmos.bech32MainPrefix, amount: argv.amount },
    timeout_timestamp: (Date.now() + argv.timeout * 1000) * 10 ** 6
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/ibc.applications.transfer.v1.MsgTransfer',
    value: message.ibc.applications.transfer.v1.MsgTransfer.encode(msgSend).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: argv.memo
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};
