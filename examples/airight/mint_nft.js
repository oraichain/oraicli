const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    mint_nft: {
      royalty: 3000000,
      creator_type: 'provider',
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      creator: process.env.ROYALTY_OWNER,
      mint: {
        mint: {
          description: 'abcd',
          image: 'abcdef',
          name: 'my name',
          owner: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573',
          token_id: '23',
        },
      },
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' `;

executeCMD(command);
