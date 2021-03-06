import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import totalRewards from './get-total-rewards';
import xlsx from 'xlsx';

const num = 1000000;
const nativeAddrCol = 'A';
const rewardCol = 'H';

function calculateTotalRewards(sheet) {
  let total = 0.0;
  for (let j = 2; sheet[rewardCol + j.toString()] !== undefined; j++) {
    let amount = Math.round(parseFloat(sheet[rewardCol + j.toString()].v) * num);
    //let amount = 1;
    console.log('amount: ', amount);
    total += amount;
  }
  return total;
}

export default async (yargs: Argv) => {
  const { argv } = yargs
    .option('mnemonics', {
      describe: '',
      type: 'array',
      default: process.env.TEAM_STAKE_MNEMONIC.split(',')
    })
    .option('rewardFile', {
      describe: '',
      type: 'string'
    })
    .option('gas-limit', {
      describe: '',
      type: 'string',
      default: '200000'
    });

  const finalReceiveObject = {};

  const message = Cosmos.message;
  const { mnemonics, rewardFile } = argv;
  const book = xlsx.readFile(__dirname + '/' + rewardFile);

  console.log('book sheet name: ', book.Props.SheetNames);
  for (let i = 0; i < book.SheetNames.length; i++) {
    let sheet = book.Sheets[book.SheetNames[i]];
    let outputs = [];
    let total = 0.0;
    // j = 2 because the first row is reserved for sender address
    for (let j = 2; sheet[nativeAddrCol + j.toString()] !== undefined; j++) {
      let amount = Math.round(parseFloat(sheet[rewardCol + j.toString()].v) * num);
      //let amount = 1;
      let output = {
        address: sheet[nativeAddrCol + j.toString()].v,
        coins: [{ denom: cosmos.bech32MainPrefix, amount: amount.toString() }]
      };
      outputs.push(output);
      total += sheet[rewardCol + j.toString()].v;
    }
    finalReceiveObject[book.SheetNames[i]] = outputs;
  }

  // console.log("output length: ", finalReceiveObject[book.SheetNames[0]].length)
  // get first sheet only
  for (let i = 0; i < 1; i++) {
    // the first row is reserved for the sender address
    //console.log("mnemonic: ", mnemonics);
    const childKey = cosmos.getChildKey(mnemonics[i]);
    const sender = cosmos.getAddress(childKey);
    console.log('sender: ', sender);
    const totalRewards = calculateTotalRewards(book.Sheets[book.SheetNames[i]]);
    console.log('total rewards: ', totalRewards / num);
    // temp reward to test
    const inputs = [
      {
        address: sender,
        coins: [{ denom: cosmos.bech32MainPrefix, amount: String(totalRewards) }]
      }
    ];

    const outputs = finalReceiveObject[book.SheetNames[i]];

    const msgMultiSend = new message.cosmos.bank.v1beta1.MsgMultiSend({
      inputs: inputs,
      outputs: outputs
    });

    // console.log("msg multisend: ", msgMultiSend)

    const msgMultiSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.bank.v1beta1.MsgMultiSend',
      value: message.cosmos.bank.v1beta1.MsgMultiSend.encode(msgMultiSend).finish()
    });

    const txBody = new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgMultiSendAny],
      memo: ''
    });

    try {
      const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), parseInt(700910));
      console.log(response);
    } catch (ex) {
      console.log(ex);
    }
  }
};

// yarn oraicli distr send-rewards --rewardFile reward.xlsx
