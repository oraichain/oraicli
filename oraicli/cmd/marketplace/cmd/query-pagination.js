import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import crypto from 'crypto';

declare var cosmos: Cosmos;
const message = Cosmos.message;

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
    const offset = getOffset("orai1dcr90cpandxqjqxgx8xxrhlt9r8sywatsr7v2l", "1267", "orai16xj6keqd4dmaeq6argj2py4l346yldknkg3lg8");
    console.log("offset: ", offset);

    let input = JSON.stringify({
        ai_royalty: {
            get_royalties: {
                offset,
                limit: 50
            }
        }
    })

    console.log(`${cosmos.url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);
    const { data } = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(input).toString('base64')}`);

    // console.log("data: ", data);
    console.log("data: ", data.length);
};

// offering: orai109pfqmlv7cq8csv7gml40vsxkm563qyva5p0jr

// royalty: orai1ez6aay60j9kvtn9vmdssjtty9agmzhrdc6nh4a