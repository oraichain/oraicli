const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    balance: {
      owner: 'orai1qct5xj390rd3z9nky6dw5audj84zxez4pknylu',
      token_id: '5',
    },
  });

  // const encoded = JSON.stringify({
  //   is_approved_for_all: {
  //     owner: 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573',
  //     operator: process.env.ROYALTY_CONTRACT,
  //   },
  // });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm query ${process.env.NFT_TOKEN_CONTRACT} --input '${encoded}'`;

executeCMD(command);

const result = { balance: '9' };
