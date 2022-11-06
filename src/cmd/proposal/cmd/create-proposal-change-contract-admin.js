import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';

export default async (yargs: Argv) => {
  const { argv } = yargs.
    option('new_admin', {
      describe: 'new admin of the contract',
      type: 'string'
    })
    .option('contract', {
      describe: 'contract to change admin',
      type: 'string'
    })
    .option('title', {
      describe: 'proposal title',
      type: 'string'
    })
    .option('description', {
      describe: 'proposal description',
      type: 'string'
    })
    ;

  const message = Cosmos.message;
  const childKey = cosmos.getChildKey(argv.mnemonic);
  const { new_admin, contract, title, description } = argv;

  const createProposal = new message.cosmwasm.wasm.v1beta1.UpdateAdminProposal({
    title: title || 'hello world',
    description: description || 'foo bar',
    new_admin,
    contract
  });

  const createProposalMsgAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.UpdateAdminProposal',
    value: message.cosmwasm.wasm.v1beta1.UpdateAdminProposal.encode(createProposal).finish()
  });

  const msgGov = new message.cosmos.gov.v1beta1.MsgSubmitProposal({
    content: createProposalMsgAny,
    proposer: cosmos.getAddress(childKey),
    initial_deposit: [{ denom: cosmos.bech32MainPrefix, amount: '1' }]
  });

  const msgGovAny = new message.google.protobuf.Any({
    type_url: '/cosmos.gov.v1beta1.MsgSubmitProposal',
    value: message.cosmos.gov.v1beta1.MsgSubmitProposal.encode(msgGov).finish()
  });

  const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgGovAny]
  });

  try {
    const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    console.log(res);
  } catch (error) {
    console.log('error: ', error);
  }
};

// example: yarn oraicli proposals create-proposal-change-contract-admin --new_admin orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573 --contract orai18vd8fpwxzck93qlwghaj6arh4p7c5n8903w6c8 --title "test proposal. PLEASE DO NOT DEPOSIT TOKENS" --description "test proposal. PLEASE DO NOT DEPOSIT TOKENS INTO THIS PROPOAL. IT WILL BE BURNT BECAUSE OF A FAILED PROPOSAL"
