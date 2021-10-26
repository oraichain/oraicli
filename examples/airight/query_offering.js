const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    offering: {
      get_offerings_by_contract_token_id: {
        contract: process.env.NFT_TOKEN_CONTRACT,
        token_id: '5',
      },
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm query ${process.env.ROYALTY_CONTRACT} --input '${encoded}'`;

executeCMD(command);

const result = [
  {
    id: 7,
    token_id: '5',
    contract_addr: 'orai12rrurv3qynk50tuz8eh825ku3zxdk553r4sxfn',
    seller: 'orai1qct5xj390rd3z9nky6dw5audj84zxez4pknylu',
    per_price: '12',
    amount: '2',
  },
];
