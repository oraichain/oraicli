const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    transfer_nft_directly: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      amount: '1',
      to: 'orai1qgfmfre0updedyd72shfj4xwx6nqjkqfwft225',
      token_id: '1424',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);
