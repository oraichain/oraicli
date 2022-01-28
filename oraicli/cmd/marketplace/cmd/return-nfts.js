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

    return msgSendAny;
};

const getMessages = (msgs) => {
    return new message.cosmos.tx.v1beta1.TxBody({
        messages: msgs
    });
}

const getOfferings = async (address) => {
    let offset = null;
    let url = cosmos.url;
    let offerings = [];
    let data = {};
    do {
        console.log("offset: ", offset);
        const input = JSON.stringify({
            offering: {
                get_offerings: {
                    limit: 30,
                    offset,
                    order: 1,
                },
            }
        });
        console.log(`${url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        data = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        // console.log("data: ", data.data.offerings);
        offerings = offerings.concat(data.data.offerings);
        offset = offerings[offerings.length - 1].id;
    } while (data.data.offerings.length > 0);
    offerings = [...new Set(offerings)];
    return offerings;
}

const getAuctions = async (address) => {
    let offset = null;
    let url = cosmos.url;
    let items = [];
    let data = {};
    do {
        console.log("offset: ", offset);
        const input = JSON.stringify({
            auction: {
                get_auctions: {
                    options: {
                        limit: 30,
                        offset,
                        order: 1,
                    }
                },
            }
        });
        console.log(`${url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        data = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        // console.log("data: ", data.data.items);
        items = items.concat(data.data.items);
        offset = items[items.length - 1].id;
    } while (data.data.items.length > 0);
    items = [...new Set(items)];
    return items;
}

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('address', {
            describe: 'the smart contract address',
            type: 'string'
        })

    const [address] = argv._.slice(-1);
    const token_ids = [
        '1327', '1328',
        '1330', '1332',
        '1344', '1348',
        '1368', '1412'
    ];

    const childKey = cosmos.getChildKey(argv.mnemonic);
    const sender = cosmos.getAddress(childKey);

    let offerings = await getOfferings(address);
    offerings = offerings.filter(off => token_ids.includes(off.token_id));
    console.log("offerings: ", offerings);

    let auctions = await getAuctions(address);
    auctions = auctions.filter(off => token_ids.includes(off.token_id));
    console.log("auction length: ", auctions.length);

    // emergency cancel auctions
    const msgs = [];
    for (let auction of auctions) {
        const input = Buffer.from(JSON.stringify({
            emergency_cancel_auction: {
                auction_id: auction.id,
            }
        }));

        // update nfts
        const handleMsgAny = getHandleMessage(address, input, sender, argv.amount);
        msgs.push(handleMsgAny);
    }
    try {
        const res = await cosmos.submit(childKey, getMessages(msgs), 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), 50000000000);
        console.log(res);
    } catch (error) {
        console.log('error: ', error);
    }

    // let nfts = await getNfts(address, argv.nftaddr);
    // console.log("nfts: ", JSON.stringify(nfts));
    // console.log("nft length: ", nfts.length);
    // const input = Buffer.from(JSON.stringify({
    //     migrate_version: {
    //         nft_contract_addr: argv.nftaddr,
    //         token_ids: nfts,
    //         new_marketplace: argv.market
    //     }
    // }));

    // // update nfts
    // const txBody = getHandleMessage(address, input, sender, argv.amount);
    // try {
    //     const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
    //     console.log(res);
    // } catch (error) {
    //     console.log('error: ', error);
    // }
};