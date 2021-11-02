const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    approve_all: [
      process.env.NFT_TOKEN_CONTRACT,
      {
        approve_all: { operator: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573' },
      },
    ],
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.MULTIPLE_CREATORS_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/676EF36073B962973AF5D92EB6CA19F6100D205BEC0C7078F663D06B80239FE8
