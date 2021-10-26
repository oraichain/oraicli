const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    update_creator_royalty: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      token_id: '1',
      creator: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573',
      creator_type: null,
      royalty: 1000000,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);
