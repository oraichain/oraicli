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
          token_id: '8',
          to: '',
          value: '10',
        },
      },
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/C0DD2B27AB92F65E09A9F5C61049690184BAF8F9A787780263C8913DED62E84F
