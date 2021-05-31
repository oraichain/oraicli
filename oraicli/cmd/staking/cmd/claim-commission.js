import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';
import * as ed from 'noble-ed25519';

declare var cosmos: Cosmos;
const address = "orai1whsvq9m56tr945xcnjd527p3wpm00m6sqgum57";

export default async (yargs: Argv) => {

    // Create a private key

    const privateKey = ed.utils.randomPrivateKey(); // 32-byte Uint8Array or string.
    const msgHash = Buffer.from('Hello World');
    (async () => {
        const publicKey = await ed.getPublicKey(privateKey);
        console.log("public key; ", publicKey);
        const signature = await ed.sign(msgHash, privateKey);
        console.log("signature: ", signature)
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
