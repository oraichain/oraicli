import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs;

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);

  const createProposal = new message.ibc.core.client.v1.ClientUpdateProposal({
    title: 'test update ibc proposal',
    description: 'foo bar',
    client_id: '07-tendermint-23'
  });

  const createProposalMsgAny = {
    type_url: '/ibc.core.client.v1.ClientUpdateProposal',
    value: message.ibc.core.client.v1.ClientUpdateProposal.encode(createProposal).finish(),
    value_raw: createProposal
  };

  const msgGov = new message.cosmos.gov.v1beta1.MsgSubmitProposal({
    content: createProposalMsgAny,
    proposer: cosmos.getAddress(childKey),
    initial_deposit: [{ denom: cosmos.bech32MainPrefix, amount: '10' }]
  });

  const msgGovAny = new message.google.protobuf.Any({
    type_url: '/cosmos.gov.v1beta1.MsgSubmitProposal',
    value: message.cosmos.gov.v1beta1.MsgSubmitProposal.encode(msgGov).finish(),
    value_raw: msgGov
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgGovAny]
  });

  try {
    const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), 20000000);
    console.log(res);
  } catch (error) {
    console.log('error: ', error);
  }
};

// example: yarn oraicli proposal create-proposal-ibc
