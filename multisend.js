const Cosmos = require("@oraichain/cosmosjs").default;

const lcdUrl = "https://testnet-lcd.orai.io";
const chainId = "Oraichain-testnet";
const mnemonic = "wreck mountain work trigger cool like orchard fall segment shaft apart trim wife animal label advance toe furnace dry copy comfort about sport usage";
const toAddrs = ["orai1x6xl5kls4xkmkv3rst5tndmxtqt0u8dxhnw7cg", "orai12xzrnuawf2us6njkxzyruqwf4kutgy49cj28g6"];
const toAmount = ["1", "1"];
const amount = "2";
const fees = 100;

const message = Cosmos.message;
const cosmos = new Cosmos(lcdUrl, chainId);

cosmos.setBech32MainPrefix('orai');
const childKey = cosmos.getChildKey(mnemonic);
const address = cosmos.getAddress(childKey);

const inputs = [
    {
        address,
        coins: [{ denom: cosmos.bech32MainPrefix, amount: String(amount) }]
    }
];
let outputs = [];
for (let i = 0; i < toAddrs.length; i++) {
    let output = {
        address: toAddrs[i],
        coins: [{ denom: cosmos.bech32MainPrefix, amount: String(toAmount[i]) }]
    };
    outputs.push(output);
}
const msgMultiSend = new message.cosmos.bank.v1beta1.MsgMultiSend({
    inputs: inputs,
    outputs: outputs
});

console.log('msg multisend: ', msgMultiSend);

const msgMultiSendAny = new message.google.protobuf.Any({
    type_url: '/cosmos.bank.v1beta1.MsgMultiSend',
    value: message.cosmos.bank.v1beta1.MsgMultiSend.encode(msgMultiSend).finish()
});

const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgMultiSendAny],
    memo: ''
});

(async () => {
    try {
        const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), 5000000);
        console.log(response);
    } catch (ex) {
        console.log(ex);
    }
})();