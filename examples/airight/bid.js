const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    bid_nft: {
      auction_id: '1',
    },
  });

  console.log(encoded);
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' `;

executeCMD(command);
