const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    withdraw_nft: {
      offering_id: 17,
    },
  });

  console.log(encoded);
  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/DF868AEB622B634A3F3FBD348F817951C71218ACFBE118B9A40506CF3DA870E8
