import moment from 'moment';
const { executeCMD } = require('../../exec');

const royaltyContract = 'orai17jjedrl7ytflnj3djygwvtsqgwya9hl6xxtjpl';

const transfrom = () => {
  const encoded = JSON.stringify({
    claim_winner: {
      auction_id: 41,
    },
  });

  console.log(encoded);

  return encoded;
};

const encoded = transfrom();

const command = `yarn oraicli wasm execute ${royaltyContract} --input '${encoded}' --gas 4000000`;

// executeCMD(command);

console.log('moment(1639395600000)', moment(1639395600000).format('DD/MM/YYYY HH:mm:ss'));

// https://testnet-lcd.orai.io/cosmos/tx/v1beta1/txs/9AE65DDCEEFEED7D234AEB02254F63230E65AAA1A51D8DE205C977C2D453566D
