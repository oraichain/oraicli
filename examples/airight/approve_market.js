const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({ approve_all: { operator: process.env.ROYALTY_CONTRACT } });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.NFT_TOKEN_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/2D1093E3123260027C5988E5277050279DABC3B3BE728FDAA5CFD8A1A5A26AC8
