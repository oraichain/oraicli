import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import dotenv from 'dotenv';
dotenv.config({ silent: process.env.NODE_ENV === 'development' });

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
    const { argv } = yargs
        .option('address', {
            describe: 'the orai address',
            type: 'string',
        })
        .option('amount', {
            default: '1',
            type: 'string'
        });

    const message = Cosmos.message;
    const { address } = argv;
    console.log("receiver: ", address)
    cosmos.setBech32MainPrefix('orai');
    const listMnemonics = process.env.LIST_SEND_MNEMONIC.split(",");
    for (let i = 0; i < listMnemonics.length; i++) {
        const mnemonic = listMnemonics[i];
        const childKey = cosmos.getChildKey(mnemonic);
        const address = cosmos.getAddress(mnemonic);
        console.log("sender: ", address)
        try {
            const res = await cosmos.get(`/cosmos/bank/v1beta1/balances/${address}`);
            //console.log(res);
            const amount = parseInt(res.balances[0].amount) - 1000;
            console.log("amount: ", amount)
            const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
                from_address: cosmos.getAddress(childKey),
                to_address: argv.address,
                amount: [{ denom: cosmos.bech32MainPrefix, amount: amount.toString() }] // 10
            });

            const msgSendAny = new message.google.protobuf.Any({
                type_url: '/cosmos.bank.v1beta1.MsgSend',
                value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
            });

            const txBody = new message.cosmos.tx.v1beta1.TxBody({
                messages: [msgSendAny],
                memo: ''
            });

            try {
                const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
                console.log(response);
            } catch (ex) {
                console.log(ex);
            }
            console.log("amount: ", amount)
        } catch (ex) {
            console.log(ex);
        }
    }
};
