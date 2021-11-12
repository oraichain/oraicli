const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    buy_nft: {
      offering_id: 18,
      amount: '5',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000 --amount ${'40'}`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/D59CD774FA16DAC37C84D434FADA45467CD28C787FB81A9472DCA775B8EB35B6
