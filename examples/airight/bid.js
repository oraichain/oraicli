const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    bid_nft: {
      auction_id: '1',
    },
  });

  console.log(encoded);
  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000 --amount ${'123'}`;

executeCMD(command);
