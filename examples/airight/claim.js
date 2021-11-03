const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    claim_winner: {
      auction_id: 11,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/9AE65DDCEEFEED7D234AEB02254F63230E65AAA1A51D8DE205C977C2D453566D
