const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    burn_nft: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      token_id: '5',
      value: '1',
    },
  });

  console.log(encoded);
  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/440008DCC5433218846BFF2C654E2EBB47A585550BF80D6B69F274D920591F0E
