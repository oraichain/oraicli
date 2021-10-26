const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    send_nft: {
      contract: process.env.ROYALTY_CONTRACT,
      msg: Buffer.from(
        JSON.stringify({
          off_price: '123',
          royalty: 2000000,
        })
      ).toString('base64'),
      token_id: '1',
    },
  });

  console.log(encoded);
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.NFT_TOKEN_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);
