import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';
import Long from 'long';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
    const { argv } = yargs
        .option('proposal_id', {
            describe: 'proposal id to deposit into',
            type: 'number'
        })
        .option('amount', {
            describe: 'amount to deposit into',
            type: 'string'
        })
    const { mnemonic, amount, proposal_id } = argv;

    const message = Cosmos.message;
    const childKey = cosmos.getChildKey(mnemonic);
    const depositor = cosmos.getAddress(childKey);

    const msgDeposit = new message.cosmos.gov.v1beta1.MsgDeposit({
        proposal_id: new Long(proposal_id),
        depositor,
        amount: [{ denom: cosmos.bech32MainPrefix, amount: amount ? amount : "1" }],
    })

    const msgDepositAny = new message.google.protobuf.Any({
        type_url: '/cosmos.gov.v1beta1.MsgDeposit',
        value: message.cosmos.gov.v1beta1.MsgDeposit.encode(msgDeposit).finish()
    });

    const txBody = new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgDepositAny]
    });

    try {
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
        console.log(res);
    } catch (error) {
        console.log('error: ', error);
    }
}

// example: yarn oraicli proposals create-proposal
