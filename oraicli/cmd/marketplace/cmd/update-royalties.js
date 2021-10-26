// THIS FILE RE-CALCULATE THE CREATOR & PROVIDER ROYALTIES TO MATCH THE NEW LOGIC OF THE MARKETPLACE

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

const getRoyalties = async (address, nftAddr) => {
    let offset = null;
    let url = cosmos.url;
    let royalties = [];
    let data = {};
    do {
        const input = JSON.stringify({
            msg: {
                get_royalties_contract: {
                    contract_addr: nftAddr,
                    offset: offset,
                    limit: 30,
                    order: 1
                }
            }
        });
        console.log("input: ", input);
        console.log(`${url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        data = await fetch(`${url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`).then(data => data.json());
        royalties = royalties.concat(data.data);
        console.log("data: ", data.data);
        console.log("royalties: ", royalties[royalties.length - 1]);
        offset = {
            contract: royalties[royalties.length - 1].contract_addr,
            token_id: royalties[royalties.length - 1].token_id,
            creator: royalties[royalties.length - 1].creator,
        };
    } while (data.data.length > 0);
    royalties = royalties.filter(
        (v, i, a) => a.findIndex((t) => t.token_id === v.token_id) === i
    );
    return royalties;
}

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('address', {
            describe: 'the smart contract address',
            type: 'string'
        })
        .option('amount', {
            type: 'string'
        })
        .option('market', {
            type: 'string'
        })
        .option('nftaddr', {
            type: 'string'
        });

    const [address] = argv._.slice(-1);

    const childKey = cosmos.getChildKey(argv.mnemonic);
    const sender = cosmos.getAddress(childKey);

    let royalties = await getRoyalties(address, argv.nftaddr);
    // royalties = royalties.map(r => ({ ...r, royalty: r.royalty * Math.pow(10, 7) > Math.pow(10, 9) ? r.royalty : r.royalty * Math.pow(10, 7) }));
    // royalties = royalties.filter(r => r.creator_type === "provider");
    royalties = royalties.filter(r => r.royalty * Math.pow(10, 7) < Math.pow(10, 9));
    royalties = royalties.map(r => ({ ...r, royalty: r.royalty * Math.pow(10, 7) }));
    royalties = royalties.filter(r => r.royalty !== 0);
    console.log("royalties: ", JSON.stringify(royalties));
    console.log("royalty length: ", royalties.length);
    const input = Buffer.from(JSON.stringify({
        update_royalties: {
            royalty: royalties,
        }
    }));

    // update royalties
    const txBody = getHandleMessage(argv.market, input, sender, argv.amount);
    try {
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
        console.log(res);
    } catch (error) {
        console.log('error: ', error);
    }
};