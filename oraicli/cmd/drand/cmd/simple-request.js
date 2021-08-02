import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import sha3 from 'js-sha3';
import secp256k1 from 'secp256k1';

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

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('address', {
            describe: 'the smart contract address',
            type: 'string'
        })
        .option('user_input', {
            describe: 'unique user input',
            type: 'string',
            default: ''
        })
        .option('amount', {
            describe: 'fees to update the vrf round',
            type: 'string',
            default: '1'
        })

    const [address] = argv._.slice(-1);

    const childKey = cosmos.getChildKey(argv.mnemonic);
    const sender = cosmos.getAddress(childKey);

    // invoke handle message contract to update the randomness value. Min fees is 1orai
    const input = Buffer.from(JSON.stringify({
        request_random: {
            input: Buffer.from("hello world").toString('base64')
        }
    }));

    const txBody = getHandleMessage(address, input, sender, argv.amount);
    try {
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
        console.log(res);
        const round = JSON.parse(res.tx_response.raw_log)[0].events[2].attributes[3].value;
        console.log("round: ", JSON.parse(res.tx_response.raw_log)[0].events[2].attributes[3].value);

        const attributes = await checkAggregateSig(round, address);
        const aggregateSig = JSON.parse(Buffer.from(attributes[3].value, 'base64').toString());
        console.log("aggregate sig information: ", aggregateSig);

        const signedSig = Uint8Array.from(Buffer.from(aggregateSig.signed_sig, 'base64'));
        const message = Uint8Array.from(Buffer.from(aggregateSig.sig, 'base64'));
        const hashedMsg = sha3.keccak256(message);
        const finalHash = Uint8Array.from(Buffer.from(hashedMsg, 'hex'));
        const pub = Uint8Array.from(Buffer.from(aggregateSig.pubkey, 'base64'));
        const isSigned = secp256k1.ecdsaVerify(signedSig, finalHash, pub);
        console.log("is signed: ", isSigned);
    } catch (error) {
        console.log('error: ', error);
    }
};

const checkAggregateSig = async (round, address) => {
    console.log(`/cosmos/tx/v1beta1/txs?events=wasm.function_type%3D%27aggregate_sig%27&events=wasm.round%3D%27${round}%27&events=wasm.contract_address%3D%27${address}%27`)
    try {
        const expectedResult = await cosmos.get(`/cosmos/tx/v1beta1/txs?events=wasm.function_type%3D%27aggregate_sig%27&events=wasm.round%3D%27${round}%27&events=wasm.contract_address%3D%27${address}%27`);
        console.log("response: ", expectedResult.tx_responses[0]);
        const attributes = JSON.parse(expectedResult.tx_responses[0].raw_log)[0].events[1].attributes;
        return attributes;
    } catch (error) {
        console.log("error: ", error);
        await sleep(5000);
        return await checkAggregateSig(round, address);
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}