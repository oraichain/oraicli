const ed = require('noble-ed25519'); // https://www.npmjs.com/package/noble-ed25519
const crypto = require('crypto'); // https://nodejs.org/api/crypto.html

// Create a private key

const privRandom = ed.utils.randomPrivateKey()
console.log("priv random: ", privRandom);

const privateKey = new Uint8Array([91, 76, 13, 131, 127, 103, 132, 13,
    134, 176, 248, 242, 127, 217, 39, 60,
    93, 36, 142, 98, 228, 197, 120, 35,
    181, 87, 125, 184, 37, 4, 38, 19]);
console.log("private key: ", privateKey);
const msg = {
    nft_addr: "orai1um7dwaz4uexd2zjl0yzeaqw20ltq7y5qpcq35n",
    token_id: "1009",
    orai_addr: "orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573",
    nonce: 1
}

// hash the object and convert it into buffer
let msgHash = Buffer.from(crypto.createHash('sha256').update(JSON.stringify(msg)).digest('hex'));
console.log("msg hash: ", msgHash.toString('hex'));
(async () => {
    const publicKey = await ed.getPublicKey(privateKey);
    console.log("public key; ", Buffer.from(publicKey).toString('base64'));
    const signature = await ed.sign(msgHash, privateKey);
    // console.log("signature: ", Buffer.from(signature).toString('base64'));
    const isSigned = await ed.verify(signature, msgHash, publicKey);
    console.log("is signed: ", isSigned);
})();
