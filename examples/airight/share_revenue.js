const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    share_revenue: {},
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.MULTIPLE_CREATORS_CONTRACT} --input '${encoded}' --gas 4000000`;

executeCMD(command);
