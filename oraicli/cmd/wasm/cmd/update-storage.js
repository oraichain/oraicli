import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;
const message = Cosmos.message;

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

const getOffset = (contract, id, creator) => {
    return {
        contract,
        token_id: id,
        creator

    }
};

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('address', {
            describe: 'the smart contract address',
            type: 'string'
        })
        .option('amount', {
            type: 'string'
        });

    const [address] = argv._.slice(-1);

    const childKey = cosmos.getChildKey(argv.mnemonic);
    const sender = cosmos.getAddress(childKey);

    console.log(`${cosmos.url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(argv.input).toString('base64')}`);
    let { data } = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(argv.input).toString('base64')}`);

    // console.log("data: ", data);
    while (true) {
        let finalElement = data[data.length - 1];
        let input = JSON.stringify({
            ai_royalty: {
                get_royalties: {
                    offset: finalElement ? getOffset(finalElement.contract_addr, finalElement.token_id, finalElement.creator) : null,
                }
            }
        })
        let temp = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        console.log("temp: ", temp);
        if (temp.data.length === 0) {
            await recoverData(data, sender, childKey, finalElement, argv);
            break;
        }
        data = data.concat(temp.data);
        data = [...new Set(data)];
        if (data.length > 100) {
            data = await recoverData(data, sender, childKey, finalElement, argv);
        }
    }
};

const recoverData = async (data, sender, childKey, finalElement, argv) => {
    console.log("data length: ", data.length);

    const input = Buffer.from(JSON.stringify({
        update_royalties: {
            royalty: data
        }
    }))

    const txBody = getHandleMessage("orai1xauzul9c5nfya80rsdv8ey948u5zrwztena58d", input, sender, null);
    try {
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
        console.log(res);
    } catch (error) {
        console.log('error: ', error);
    }
    data = [finalElement];
    return data;
}