const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    sell_nft: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      per_price: '12',
      amount: '5',
      token_id: '8',
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/776F70811AA716930204B98466A19320E1E12442261D3A1603305A800B787E76
