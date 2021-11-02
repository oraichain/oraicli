const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    offering: {
      get_unique_offering: {
        seller: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573',
        token_id: '8',
        contract: process.env.NFT_TOKEN_CONTRACT,
      },
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm query ${process.env.ROYALTY_CONTRACT} --input '${encoded}'`;

executeCMD(command);

const result = {
  id: 10,
  token_id: '8',
  contract_addr: 'orai12rrurv3qynk50tuz8eh825ku3zxdk553r4sxfn',
  seller: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573',
  per_price: '12',
  amount: '5',
};
