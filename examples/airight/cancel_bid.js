const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    cancel_bid: {
      auction_id: 6,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/8A069A9E9888D07F6135DD96B026951DA6C2E02C4BD778481D4F2AE2E4C51C37
