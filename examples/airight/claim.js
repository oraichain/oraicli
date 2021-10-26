const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    claim_winner: {
      auction_id: 6,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/55213548130C3196A846094E4E199C4CDFCC2707CA19F1C3BCA1E6C6AD79FC16
