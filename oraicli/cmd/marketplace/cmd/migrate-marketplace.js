import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

const message = Cosmos.message;

const getStoreMessage = (wasm_byte_code, sender, source) => {
    const msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
        wasm_byte_code,
        sender,
        source: source ? source : ""
    });

    const msgSendAny = new message.google.protobuf.Any({
        type_url: '/cosmwasm.wasm.v1beta1.MsgStoreCode',
        value: message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish()
    });

    return new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgSendAny]
    });
};

const getInstantiateMessage = (code_id, init_msg, sender, label = '', amount = '') => {
    const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
    const msgSend = new message.cosmwasm.wasm.v1beta1.MsgInstantiateContract({
        code_id,
        init_msg,
        label,
        sender,
        sent_funds
    });

    const msgSendAny = new message.google.protobuf.Any({
        type_url: '/cosmwasm.wasm.v1beta1.MsgInstantiateContract',
        value: message.cosmwasm.wasm.v1beta1.MsgInstantiateContract.encode(msgSend).finish()
    });

    return new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgSendAny]
    });
};

const getHandleMessage = (contract, msg, sender, amount) => {
    const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
    const msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
        contract,
        msg,
        sender,
        sent_funds
    });

    const msgSendAny = new message.google.protobuf.Any({
        type_url: '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
        value: message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(msgSend).finish()
    });

    return new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgSendAny]
    });
};

const getSendMessage = (from_address, to_address, coin) => {
    const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
        from_address,
        to_address,
        amount: [coin] // 10
    });

    const msgSendAny = new message.google.protobuf.Any({
        type_url: '/cosmos.bank.v1beta1.MsgSend',
        value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
    });

    const txBody = new message.cosmos.tx.v1beta1.TxBody({
        messages: [msgSendAny],
        memo: ""
    });
    return txBody;
};

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('file', {
            describe: 'the smart contract file',
            type: 'string'
        })
        .option('label', {
            describe: 'the label of smart contract',
            type: 'string'
        })
        .option('source', {
            describe: 'the source code of the smart contract',
            type: 'string'
        })
        .option('fees', {
            describe: 'the transaction fees',
            type: 'string'
        }).option('amount', {
            type: 'string'
        }).option('markethub', {
            type: 'string'
        }).option('nftcontract', {
            type: 'string'
        })
        .option('oldmarket', {
            type: 'string'
        });

    const [file] = argv._.slice(-1);

    const { gas, source, mnemonic, fees, label, input, amount, markethub, nftcontract, minter_mnemonic, oldmarket } = argv;
    const childKey = cosmos.getChildKey(mnemonic);
    const minterChildKey = cosmos.getChildKey(minter_mnemonic);
    const sender = cosmos.getAddress(childKey);
    const minterSender = cosmos.getAddress(minterChildKey);

    const wasmBody = fs.readFileSync(file).toString('base64');

    let txBody = getStoreMessage(wasmBody, sender, source);

    try {
        let res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);
        // console.log('res: ', res);
        if (res.tx_response.code !== 0) {
            console.log('response: ', res);
        }
        console.log('res: ', res);

        // next instantiate code
        const codeId = res.tx_response.logs[0].events[0].attributes.find((attr) => attr.key === 'code_id').value;
        let payload = Buffer.from(input).toString('base64');
        txBody = getInstantiateMessage(codeId, payload, sender, label);
        res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

        console.log(res);
        let address = JSON.parse(res.tx_response.raw_log)[0].events[1].attributes[0].value;

        // update markethub implementation
        payload = Buffer.from(JSON.stringify({
            update_implementation: {
                implementation: address
            }
        }));

        txBody = getHandleMessage(markethub, payload, sender, amount);
        res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);
        console.log(res);

        // query balance of the marketplace
        const data = await cosmos.get(`/cosmos/bank/v1beta1/balances/${oldmarket}`);

        // withdraw funds to the new marketplace
        payload = Buffer.from(JSON.stringify({
            withdraw_funds: {
                funds: data.balances[0]
            }
        }));

        txBody = getHandleMessage(oldmarket, payload, sender, amount);
        res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);
        console.log(res);

        // transfer funds to the new marketplace
        txBody = getSendMessage(sender, address, data.balances[0]);
        res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);
        console.log(res);

        // change minter

        payload = Buffer.from(JSON.stringify({
            change_minter: address
        }));
        txBody = getHandleMessage(nftcontract, payload, minterSender, amount);
        res = await cosmos.submit(minterChildKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);
        console.log(res);

        console.log('contract address: ', address);

    } catch (error) {
        console.log("error: ", error);
    }
};