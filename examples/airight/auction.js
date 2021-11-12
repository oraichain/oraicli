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
      end_timestamp: new Date(2021, 11, 3, 3, 24, 0).getTime().toString(),
      token_id: '1372',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/C545C1CA197D0D024AD9CD4332F2CE87F4103C11FDDA9A0AB09A192C20612CED
