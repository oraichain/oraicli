import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';
import Long from 'long';

declare var cosmos: Cosmos;
const message = Cosmos.message;

const checkVoteOption = (option) => {
    switch (option) {
        case 1:
            return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_YES
        case 2:
            return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_ABSTAIN
        case 3:
            return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_NO
        case 4:
            return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_NO_WITH_VETO
        default:
            return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_ABSTAIN
    }
}

export default async (yargs: Argv) => {
    const { argv } = yargs
        .option('proposal_id', {
            describe: 'proposal id to deposit into',
            type: 'number'
        })
        .option('option', {
            describe: 'vote option',
            type: 'number'
        })
    const { mnemonic, amount, proposal_id, option } = argv;
    const childKey = cosmos.getChildKey(mnemonic);
    const voter = cosmos.getAddress(childKey);
    const msgVote = new message.cosmos.gov.v1beta1.MsgVote({
        proposal_id: new Long(proposal_id),
        voter,
        option: checkVoteOption(option)
    })

    const msgVoteAny = new message.google.protobuf.Any({
        type_url: '/cosmos.gov.v1beta1.MsgVote',
        value: message.cosmos.gov.v1beta1.MsgVote.encode(msgVote).finish()
    });

    const txBody = new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgVoteAny]
    });

    try {
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
        console.log(res);
    } catch (error) {
        console.log('error: ', error);
    }
}

// example: yarn oraicli proposals create-proposal
