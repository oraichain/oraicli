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
    return msgSendAny
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
    return msgSendAny;
};

export default async (yargs: Argv) => {
    const { argv } = yargs
        .option('markethub', {
            type: 'string'
        }).option('newmarket', {
            type: 'string'
        })
        .option('nftcontract', {
            type: 'string'
        })
        .option('oldmarket', {
            type: 'string'
        });

    const [file] = argv._.slice(-1);

    const { gas, mnemonic, input, markethub, minter_mnemonic, newmarket, oldmarket, nftcontract } = argv;
    const childKey = cosmos.getChildKey(mnemonic);
    const minterChildKey = cosmos.getChildKey(minter_mnemonic);
    const sender = cosmos.getAddress(childKey);
    const minterSender = cosmos.getAddress(minterChildKey);
    const fees = 0;

    let messages = [];

    try {
        let address = newmarket;
        console.log("address: ", address);

        // update markethub implementation
        console.log("update markethub imple");
        let payload = Buffer.from(JSON.stringify({
            update_implementation: {
                implementation: address
            }
        }));

        messages.push(getHandleMessage(markethub, payload, sender));

        // query balance of the marketplace
        const data = await cosmos.get(`/cosmos/bank/v1beta1/balances/${oldmarket}`);

        if (+data.balances[0].amount > 0) {
            // withdraw funds to the new marketplace
            console.log("withdraw funds to new marketplace");
            payload = Buffer.from(JSON.stringify({
                withdraw_funds: {
                    funds: data.balances[0]
                }
            }));

            messages.push(getHandleMessage(oldmarket, payload, sender));
            console.log("data balance: ", data.balances)

            // transfer funds to the new marketplace
            messages.push(getSendMessage(sender, address, data.balances[0]));
        }
        // // change minter
        console.log("change minter");

        payload = Buffer.from(JSON.stringify({
            change_minter: {
                minter: address
            }
        }));
        messages.push(getHandleMessage(nftcontract, payload, sender));
        const txBody = new message.cosmos.tx.v1beta1.TxBody({
            messages
        })
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', 0, gas);
        console.log(res);

    } catch (error) {
        console.log("error: ", error);
    }
};

// yarn oraicli marketplace migrate - marketplace--markethub orai14tqq093nu88tzs7ryyslr78sm3tzrmnpem6fak--newmarket orai1m0cdln6klzlsk87jww9wwr7ksasa6cnava28j5--oldmarket orai1s22g3qfl48fq04yatzphd49tjcpja0u7uaancl--nftcontract orai1c3phe2dcu852ypgvt0peqj8f5kx4x0s4zqcky4--gas 30000000