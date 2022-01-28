import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('oldName', {
      describe: 'the old oscript name',
      type: 'string'
    })

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);

  const createProposal = new message.cosmos.params.v1beta1.ParameterChangeProposal({
    title: "hello world",
    description: "foo bar",
    changes: [{
      subspace: "staking",
      key: "UnbondingTime",
      value: JSON.stringify("36000")
    }]
  })

  const createProposalMsgAny = new message.google.protobuf.Any({
    type_url: '/cosmos.params.v1beta1.ParameterChangeProposal',
    value: message.cosmos.params.v1beta1.ParameterChangeProposal.encode(createProposal).finish(),
    value_raw: createProposal,
  });

  const msgGov = new message.cosmos.gov.v1beta1.MsgSubmitProposal({
    content: createProposalMsgAny,
    proposer: cosmos.getAddress(childKey),
    initial_deposit: [{ denom: cosmos.bech32MainPrefix, amount: "10" }],
  })

  const msgGovAny = new message.google.protobuf.Any({
    type_url: '/cosmos.gov.v1beta1.MsgSubmitProposal',
    value: message.cosmos.gov.v1beta1.MsgSubmitProposal.encode(msgGov).finish(),
    value_raw: msgGov
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgGovAny]
  });


  try {
    const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), 'auto');
    console.log(res);
  } catch (error) {
    console.log('error: ', error);
  }
}

// example: yarn oraicli proposals create-proposal
