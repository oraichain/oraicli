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
          token_id: '1363',
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

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/13265C1604E43AAAD223CF4359CE6F49E7988805F3194D9C32CE2DE066D5FD3B
