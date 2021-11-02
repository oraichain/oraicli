const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    mint1155: [
      process.env.ROYALTY_CONTRACT,
      {
        mint_nft: {
          royalty: 3000000,
          creator_type: 'provider',
          contract_addr: process.env.NFT_TOKEN_CONTRACT,
          creator: process.env.ROYALTY_OWNER,
          mint: {
            mint: {
              token_id: '6',
              to: '',
              value: '10',
            },
          },
        },
      },
    ],
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.MULTIPLE_CREATORS_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/EB96E4D3FFB664BEA534BB2BD04BC9BC20479E3699D04D8C975B74E18551AEEB
