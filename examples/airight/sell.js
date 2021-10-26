const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    send_nft: {
      contract: 'orai1l26msu7jdng87c2f2mhtfp037ann0pjmexn2z8',
      msg: Buffer.from(
        JSON.stringify({
          off_price: '123',
          royalty: 2000000,
        })
      ).toString('base64'),
      token_id: '1',
    },
  });

  console.log(encoded);
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' `;

executeCMD(command);
