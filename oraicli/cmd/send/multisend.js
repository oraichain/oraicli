import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('amount', {
      default: '10',
      type: 'string'
    })
    .option('receivers', {
      type: 'array'
    })
    .option('receiver-amounts', {
      type: 'array'
    });

  const message = Cosmos.message;
  const sender = cosmos.getAddress(argv.mnemonic);
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const [amount] = argv._.slice(-1);
  const { receivers, receiverAmounts } = argv;
  let totalAmount = 0;
  for (let i = 0; i < receiverAmounts.length; i++) {
    totalAmount += receiverAmounts[i];
  }
  if (amount !== totalAmount) {
    console.log('sending amount must be equal to total receive amounts');
    return;
  }
  if (receivers.length !== receiverAmounts.length) {
    console.log('total number of receivers does not equal total number of receiver amounts');
    return;
  }
  const inputs = [
    {
      address: sender,
      coins: [{ denom: cosmos.bech32MainPrefix, amount: String(amount) }]
    }
  ];
  let outputs = [];
  for (let i = 0; i < receivers.length; i++) {
    let output = {
      address: receivers[i],
      coins: [{ denom: cosmos.bech32MainPrefix, amount: String(receiverAmounts[i]) }]
    };
    outputs.push(output);
  }
  const msgMultiSend = new message.cosmos.bank.v1beta1.MsgMultiSend({
    inputs: inputs,
    outputs: outputs
  });

  console.log('msg multisend: ', msgMultiSend);

  const msgMultiSendAny = new message.google.protobuf.Any({
    type_url: '/cosmos.bank.v1beta1.MsgMultiSend',
    value: message.cosmos.bank.v1beta1.MsgMultiSend.encode(msgMultiSend).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgMultiSendAny],
    memo: ''
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(response);
  } catch (ex) {
    console.log(ex);
  }
};

// yarn oraicli multisend 40 --receivers orai14ruagqc8ta5v452207t6n9cyautyjnzl39hrjh orai1nayufsvk9fdwfz5k9ytacl62uf28s4puaz67h8 orai1t5g84uyusz9d8jrpfql99ptg8l75ck3l8rrvd4 --receiver-amounts 10 10 20
