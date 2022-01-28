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

const getNfts = async (owner, address) => {
    let offset = null;
    let url = cosmos.url;
    let nfts = [];
    let data = {};
    do {
        const input = JSON.stringify({
            tokens: {
                owner,
                start_after: offset,
                limit: 30
            }
        });
        console.log(`${url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        data = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
        nfts = nfts.concat(data.data.tokens);
        // console.log("data: ", data.data.tokens);
        // console.log("nfts: ", nfts[nfts.length - 1]);
        offset = nfts[nfts.length - 1];
    } while (data.data.tokens.length > 0);
    nfts = [...new Set(nfts)];
    return nfts;
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
        .option('newmarket', {
            type: 'string'
        })
        .option('nftaddr', {
            type: 'string'
        });

    const [address] = argv._.slice(-1);

    const childKey = cosmos.getChildKey(argv.mnemonic);
    const sender = cosmos.getAddress(childKey);

    let nfts = await getNfts(address, argv.nftaddr);
    // console.log("nfts: ", JSON.stringify(nfts));
    console.log("nft length: ", nfts.length);
    const inp = JSON.stringify({
        migrate_version: {
            nft_contract_addr: argv.nftaddr,
            token_ids: nfts,
            new_marketplace: argv.newmarket
        }
    });
    console.log("input: ", inp);
    const input = Buffer.from(inp);

    // // // update nfts
    // const txBody = getHandleMessage(address, input, sender, argv.amount);
    // try {
    //     const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), 5000000000);
    //     console.log(res);
    // } catch (error) {
    //     console.log('error: ', error);
    // }
};

// yarn oraicli marketplace migrate-version orai17jjedrl7ytflnj3djygwvtsqgwya9hl6xxtjpl --nftaddr orai1ase8wkkhczqdda83f0cd9lnuyvf47465j70hyk --newmarket orai10kkcjrg8plsmc6vfc9wsvetjqsgz9aqe8yjktw