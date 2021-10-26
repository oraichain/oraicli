const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    send_nft: {
      contract: 'orai1l26msu7jdng87c2f2mhtfp037ann0pjmexn2z8',
      msg: Buffer.from(
        JSON.stringify({
          price: (1 * 10 ** 6).toString(),
          start: null,
          step_price: parseInt(1 * 10 ** 6),
          royalty: 2000000,
          end: 3544319,
          buyout_price: parseFloat(30 * 10 ** 6).toString(),
          start_timestamp: new Date().getTime().toString(),
          end_timestamp: new Date(2021, 10, 27, 3, 24, 0).getTime().toString(),
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
