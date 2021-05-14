import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';
import KSUID from 'ksuid';
import Long from 'long';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('oscript-name', {
      describe: 'the oracle script name',
      type: 'string'
    })
    .positional('validator-count', {
      describe: 'the number of validators',
      type: 'string'
    })
    .option('request-fees', {
      describe: 'fees that user is willing to pay',
      type: 'string'
    });

  const req_id = KSUID.randomSync().string;

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);

  const [oscriptName, count] = argv._.slice(-2);
  const { input, expectedOutput, requestFees } = argv;
  // get accAddress in binary
  const accAddress = bech32.fromWords(bech32.toWords(childKey.identifier));
  const msgSend = new message.oraichain.orai.airequest.MsgSetAIRequest({
    request_id: req_id,
    oracle_script_name: oscriptName,
    creator: accAddress,
    validator_count: new Long(count),
    fees: requestFees ? '0orai' : requestFees,
    input: Buffer.from(input),
    expected_output: Buffer.from(expectedOutput)
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/oraichain.orai.airequest.MsgSetAIRequest',
    value: message.oraichain.orai.airequest.MsgSetAIRequest.encode(msgSend).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: 'set-aireq'
  });

  try {
    const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
    console.log(response);
    console.log('request id: ', req_id);
    const data = await cosmos.get(`/airesult/fullreq/${req_id}`);
    console.log('request full information: ', data);
  } catch (ex) {
    console.log(ex);
  }
};

// yarn oraicli airequest set-aireq cv021_os 1 --chain-id $CHAIN_ID --input '{"hash": "QmR27t4rQ8J46T77za9BmguVMapJTWU4ASbBDXSFwFNmGK"}' --fees 50orai
