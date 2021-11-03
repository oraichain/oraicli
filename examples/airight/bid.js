const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    bid_nft: {
      auction_id: 11,
      per_price: '20',
    },
  });

  console.log(encoded);
  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${process.env.ROYALTY_CONTRACT} --input '${encoded}' --gas 4000000 --amount ${'60'}`;

executeCMD(command);

// just bid
// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/2D8D2053BCA2D7D95BF99D019CC2864857CD55DF4EC968627400C061465462B2

// buyout price
// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/C7D1878B35689B1F7CA57641A197AE9D2637417C9645E727DA54F58EF45F7B9F
