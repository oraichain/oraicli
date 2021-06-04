import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';
import * as ed from 'noble-ed25519';
import crypto from 'crypto';

declare var cosmos: Cosmos;
const address = "orai1whsvq9m56tr945xcnjd527p3wpm00m6sqgum57";

export default async (yargs: Argv) => {

    // Create a private key

    const privateKey = new Uint8Array([91, 76, 13, 131, 127, 103, 132, 13,
        134, 176, 248, 242, 127, 217, 39, 60,
        93, 36, 142, 98, 228, 197, 120, 35,
        181, 87, 125, 184, 37, 4, 38, 19]);
    console.log("private key: ", privateKey);
    const msg = {
        nft_addr: "orai1um7dwaz4uexd2zjl0yzeaqw20ltq7y5qpcq35n",
        token_id: "1013",
        orai_addr: "orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573",
        nonce: 1
    }
    let hash = crypto.createHash('sha256').update(JSON.stringify(msg)).digest('hex');
    console.log("msg hash: ", hash);
    let msgHash = Buffer.from(hash);
    (async () => {
        const publicKey = await ed.getPublicKey(privateKey);
        console.log("public key; ", Buffer.from(publicKey).toString('base64'));
        const signature = await ed.sign(msgHash, privateKey);
        console.log("signature: ", Buffer.from(signature).toString('base64'));
        const isSigned = await ed.verify(signature, msgHash, publicKey);
        console.log("is signed: ", isSigned);
    })();

    // const { argv } = yargs;

    // const message = Cosmos.message;
    // const childKey = cosmos.getChildKey("joke satisfy inquiry miss regret rabbit answer cash moral success illness oyster hen leopard giant person together miss cube eyebrow film few kidney shoot");
    // const msgWithdraw = new message.cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission({
    //     validator_address: "oraivaloper18hr8jggl3xnrutfujy2jwpeu0l76azprkxn29v",
    // });

    // const msgWithdrawAny = new message.google.protobuf.Any({
    //     type_url: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    //     value: message.cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission.encode(msgWithdraw).finish()
    // });

    // const txBody = new message.cosmos.tx.v1beta1.TxBody({
    //     messages: [msgWithdrawAny],
    //     memo: ''
    // });

    // try {
    //     const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
    //     console.log(response);
    // } catch (ex) {
    //     console.log(ex);
    // }


};

// yarn oraicli staking withdraw
