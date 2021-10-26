const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    withdraw_nft: {
      offering_id: parseInt(offer?.offeringId),
    },
  });

  console.log(encoded);
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' `;

executeCMD(command);