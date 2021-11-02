const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    ai_royalty: {
      get_royalties_token_id: {
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
    contract_addr: 'orai12rrurv3qynk50tuz8eh825ku3zxdk553r4sxfn',
    token_id: '5',
    creator: 'orai1qct5xj390rd3z9nky6dw5audj84zxez4pknylu',
    royalty: 1800000,
    creator_type: 'creator',
  },
  {
    contract_addr: 'orai12rrurv3qynk50tuz8eh825ku3zxdk553r4sxfn',
    token_id: '5',
    creator: 'orai16xj6keqd4dmaeq6argj2py4l346yldknkg3lg8',
    royalty: 100000000,
    creator_type: 'provider',
  },
];
