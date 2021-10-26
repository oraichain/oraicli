const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    transfer_nft: {
      recipient: 'orai1dcr90cpandxqjqxgx8xxrhlt9r8sywatsr7v2l',
      token_id: '1',
    },
  });

  console.log(encoded);
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);
