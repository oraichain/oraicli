import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import { getPublicKey, sign, aggregatePublicKeys, aggregateSignatures, verify } from 'noble-bls12-381';
import crypto from 'crypto';

const roundToMessage = (round, previous_signature) => {
    const view = new DataView(new ArrayBuffer(8));
    const roundNum = BigInt(round);
    view.setBigUint64(0, roundNum);
    let buffer = Buffer.from(view.buffer);
    const hash = crypto.createHash('sha256');
    if (previous_signature) {
        hash.update(Buffer.from(previous_signature, 'base64'));
    }
    hash.update(view);
    const message = hash.digest('hex');
    return message;
};

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
        .option('address', {
            describe: 'drand address',
            type: 'string',
            default: ''
        });

    try {
        const { privateKey } = await cosmos.getChildKey(argv.mnemonic);
        const { address } = argv;
        const childKey = cosmos.getChildKey(argv.mnemonic);
        const sender = cosmos.getAddress(childKey);
        const publicKey = getPublicKey(privateKey);
        console.log('publicKey', Buffer.from(publicKey).toString('base64'));
        console.log("sender: ", sender);
        // collect current round & previous signature
        let input = {
            latest: {}
        }
        const result = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(JSON.stringify(input)).toString('base64')}`);
        console.log("result: ", result);
        if (!result) {
            console.error("result is invalid");
            return;
        }
        let { round, signature } = result.data;
        // +1 for new round, and current signature is previous signature in the next round
        const message = roundToMessage(round + 1, signature);
        signature = await sign(message, privateKey);
        signature = Buffer.from(signature, 'hex').toString('base64');
        // console.log('Round', round.toString());
        console.log("new signature: ", signature);

        // update new randomness
        input = Buffer.from(JSON.stringify({
            add: {
                signature
            }
        }));

        const txBody = getHandleMessage(address, input, sender);
        const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);
        console.log(res);
        // if the transaction is successful, we query again to get new random seed
        if (res && res.tx_response && res.tx_response.code === 0) {
            input = {
                latest: {}
            };
            const result = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(JSON.stringify(input)).toString('base64')}`);
            console.log("randomness: ", result.data.randomness);
        }
    } catch (ex) {
        console.log(ex);
    }
};
