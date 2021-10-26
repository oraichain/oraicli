const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    buy_nft: {
      offering_id: 7,
      amount: '1',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000 --amount ${'12'}`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/927B3A3478E0A528D513E5954197674D5AF17DB6E2AC3142E76BCCE1836788A9
