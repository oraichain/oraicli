import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
    const { argv } = yargs;
    const message = Cosmos.message;
    const childKey = cosmos.getChildKey(argv.mnemonic);

    // get accAddress in binary
    const accAddress = bech32.fromWords(bech32.toWords(childKey.identifier));
    const msgSend = new message.oraichain.orai.websocket.MsgCreateReport({
        requestID: "a",
        DataSourceResults: [{
            name: "foo",
            result: Uint8Array.from([0]),
            status: "success",
        }],
        TestCaseResults: [
            {
                name: "bar",
                DataSourceResults: [],
            }
        ],
        reporter: {
            address: accAddress,
            name: "bar",
            validator: Uint8Array.from([1])
        },
        fees: [{ "amount": "1", "denom": "orai" }],
        aggregatedResult: Uint8Array.from([2]),
        resultStatus: "success"
    });

    const msgSendAny = new message.google.protobuf.Any({
        type_url: '/oraichain.orai.websocket.MsgCreateReport',
        value: message.oraichain.orai.websocket.MsgCreateReport.encode(msgSend).finish()
    });

    const txBody = new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgSendAny],
        memo: 'create-report'
    });

    try {
        const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
        console.log(response);
    } catch (ex) {
        console.log(ex);
    }
};

// yarn oraicli airequest set-aireq cv021_os 1 --chain-id $CHAIN_ID --input '{"hash": "QmR27t4rQ8J46T77za9BmguVMapJTWU4ASbBDXSFwFNmGK"}' --fees 50orai
