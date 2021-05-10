const Cosmos = require("@oraichain/cosmosjs").default;

const lcdUrl = "http://localhost:1317";
const chainId = "Oraichain";
const mnemonic = "live evolve sudden hill mirror horn melody dentist timber gate replace black badge fabric prevent lucky crumble space sketch recipe option glory donkey chair";
const toAddr = "orai1x6xl5kls4xkmkv3rst5tndmxtqt0u8dxhnw7cg";
const amount = 10;
const fees = 100;

const message = Cosmos.message;
const cosmos = new Cosmos(lcdUrl, chainId);

cosmos.setBech32MainPrefix('orai');
const childKey = cosmos.getChildKey(mnemonic);
const address = cosmos.getAddress(mnemonic);

const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
    from_address: cosmos.getAddress(childKey),
    to_address: toAddr,
    amount: [{ denom: cosmos.bech32MainPrefix, amount: String(amount) }]
});

const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmos.bank.v1beta1.MsgSend',
    value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
});

const txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: ''
});

try {
    const response = cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees)).then((response) => { console.log(response) });
} catch (ex) {
    console.log(ex);
}