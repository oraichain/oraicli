const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    ask_auction_nft: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      per_price: '7',
      amount: '3',
      start: null,
      step_price: 5,
      end: 3544319,
      buyout_per_price: '20',
      start_timestamp: new Date().getTime().toString(),
      end_timestamp: new Date(2021, 10, 27, 3, 24, 0).getTime().toString(),
      token_id: '5',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/7B4B42E295628AE0F11267CC2BFFEA5A075E2B9A5A07BB961D3F83E035388EBE
