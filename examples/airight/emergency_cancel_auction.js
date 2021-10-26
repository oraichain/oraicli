const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    emergency_cancel_auction: {
      auction_id: 5,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/D517452D447D83F823DAD232F740997D40446A28D90734EAFD83C03A9E5A47B3
