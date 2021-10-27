const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    bid_nft: {
      auction_id: 7,
      per_price: '30',
    },
  });

  console.log(encoded);
  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000 --amount ${'90'}`;

executeCMD(command);

// just bid
// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/1A39836FFEA8682364716C886EEE43B5400E41506C9B5920C45001975EE12255

// buyout price
// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/673DA6B071600E2FCC0EFC94A9B9A4C3A6415C6D2557CFAED43CF444CCE6E0D3
