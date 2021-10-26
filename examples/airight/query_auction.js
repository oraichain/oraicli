const { executeCMD } = require('../exec');

const transfrom = () => {
  const encoded = JSON.stringify({
    auction: {
      get_auctions_by_contract_token_id: {
        contract: process.env.NFT_TOKEN_CONTRACT,
        token_id: '5',
        options: {},
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
  items: [
    {
      id: 2,
      token_id: '5',
      amount: '3',
      contract_addr: 'orai12rrurv3qynk50tuz8eh825ku3zxdk553r4sxfn',
      asker: 'orai1qct5xj390rd3z9nky6dw5audj84zxez4pknylu',
      bidder: null,
      start: 3548439,
      end: 3598439,
      per_price: '7',
      orig_per_price: '7',
      buyout_per_price: '20',
      cancel_fee: null,
      start_timestamp: '1635242201549',
      end_timestamp: '1637958240000',
      step_price: 5,
    },
  ],
};
