const ed = require('noble-ed25519'); // https://www.npmjs.com/package/noble-ed25519
const crypto = require('crypto'); // https://nodejs.org/api/crypto.html

// Create a private key

const privRandom = ed.utils.randomPrivateKey()
console.log("priv random: ", privRandom);
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
