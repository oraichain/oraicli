const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    sell_nft: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      per_price: '12',
      amount: '2',
      token_id: '5',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/65DF7040CF841B8E85830051259A9DBC68D52D7D46425BEBEA88B8AB40E2221A
