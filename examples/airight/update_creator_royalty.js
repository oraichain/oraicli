const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    update_creator_royalty: {
      contract_addr: process.env.NFT_TOKEN_CONTRACT,
      token_id: '5',
      creator: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573',
      creator_type: null,
      royalty: 1800000,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${'orai1l26msu7jdng87c2f2mhtfp037ann0pjmexn2z8'} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/8A8E648BE9BCC6CD7567ED6AE13606ABF6C0E4F62D9C15C600ECFEBAF053C669
