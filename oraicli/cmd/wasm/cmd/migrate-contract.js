import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

const message = Cosmos.message;

const getMigrateMsg = (sender, contract, code_id, migrate_msg) => {
    const msgSend = new message.cosmwasm.wasm.v1beta1.MsgMigrateContract({
        sender,
        contract,
        code_id,
        migrate_msg
    });

    const msgSendAny = new message.google.protobuf.Any({
        type_url: '/cosmwasm.wasm.v1beta1.MsgMigrateContract',
        value: message.cosmwasm.wasm.v1beta1.MsgMigrateContract.encode(msgSend).finish(),
        value_raw: msgSend,
    });

    return new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgSendAny]
    });
};

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('contract', {
            describe: 'the smart contract address',
            type: 'string'
        })
        .option('code_id', {
            describe: 'code id of the new contract',
            type: 'number'
        })
        .option('fees', {
            describe: 'the transaction fees',
            type: 'string'
        }).option('amount', {
            type: 'string'
        });

    const [contract] = argv._.slice(-1);

    const childKey = cosmos.getChildKey(argv.mnemonic);
    const sender = cosmos.getAddress(childKey);
    const { gas, code_id, input } = argv;

    const txBody = getMigrateMsg(sender, contract, code_id, Buffer.from(input));

    try {
        const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', 0, 601000000);
        console.log('response: ', response);
    } catch (error) {
        console.log("error: ", error);
    }
};

// yarn oraicli wasm migrate orai1n34m4kctfgyks9kstevd2wruqc0mytw0dm84fe --code_id 1063
