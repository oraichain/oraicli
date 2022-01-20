import { Argv } from 'yargs';
import fs from 'fs';
import Cosmos from '@oraichain/cosmosjs';

const message = Cosmos.message;

const addressSymbols = [
  {
    url: 'https://gist.githubusercontent.com/ducphamle2/ee1162517b5abf161980d1ffa77838d8/raw/794ba0100af0dff5df1d5d12ee0c4ab109716070/binance.js',
    address: 'orai1mhz3flskea749v0mnejkfptt75fsru9a94082d'
  },
  {
    url: 'https://gist.githubusercontent.com/ducphamle2/8e637099977aa66abd4d63be9ae59264/raw/7fb307513c745eddfb402a4ff5fdaf1d7c7fb58e/coinbase.js',
    address: 'orai1e8p3pteuvc7evux3ycdlhx4hfqu5lmu98967sj'
  },
  {
    url: 'https://gist.githubusercontent.com/ducphamle2/81c9887d268dc1dea16c5b72ce74f108/raw/bb974883d44623d55983597382bfb8ffaacddce6/gate.js',
    address: 'orai1yf9kcjamkktpgraj7lw9cruv2v9wv08wlkz9jr'
  },
  {
    url: 'https://gist.githubusercontent.com/ducphamle2/8ee1d1ffbf52463e48ca9949283ed1db/raw/637ffa6bb92ff262940b5ada9d08a987543bfda2/kucoin.js',
    address: 'orai13uuw849mekkguatd70z4wc8hucwvcw88v3r8s2'
  }
];
const addressIds = [
  {
    url: 'https://gist.githubusercontent.com/ducphamle2/d23e4dc7e0967205298efffe8096c2d7/raw/fbbb8461e010ab54ba1ce30b2b2d41f18574e546/coincap.js',
    address: 'orai1664806rc8qt7wyjau4d4e34vwnxyj2rk94l0ef'
  },
  {
    url: 'https://gist.githubusercontent.com/ducphamle2/3b99613f1fb6e51c38187820168844f2/raw/fe38a5c898a7a9e5ee92fd0e6acf09f7c9988fae/coingecko.js',
    address: 'orai1mmeeucc3kl94e2wz98txe4y4wu22reenwwqu5z'
  }
];
const symbols = [
  'BTC',
  'ETH',
  'BNB',
  'XRP',
  'DOGE',
  'USDT',
  'LINK',
  'UNI',
  'USDC',
  'BUSD',
  'ORAI',
  'DAI',
  'SOL',
  'MATIC',
  'SUSHI',
  'DOT',
  'LUNA',
  'ICP',
  'XLM',
  'ATOM',
  'AAVE',
  'THETA',
  'EOS',
  'CAKE',
  'AXS',
  'ALGO',
  'MKR',
  'KSM',
  'XTZ',
  'FIL',
  'AMP ',
  'RUNE',
  'COMP',
  'OHM',
  'TIME',
  'MIM',
  'SPELL',
  'ICE',
  'GALA',
  'MANA',
  'ENJ',
  'SAND'
];
const ids = [
  'bitcoin',
  'ethereum',
  'binance-coin',
  'ripple',
  'dogecoin',
  'tether',
  'chainlink',
  'uniswap',
  'usd-coin',
  'binance-usd',
  'oraichain-token',
  'multi-collateral-dai',
  'solana',
  'polygon',
  'sushiswap',
  'polkadot',
  'terra-luna',
  'internet-computer-price',
  'stellar',
  'cosmos',
  'aave',
  'theta',
  'eos',
  'pancakeswap',
  'axie-infinity',
  'algorand',
  'maker',
  'kusama',
  'tezos',
  'filecoin',
  'amp',
  'thorchain',
  'compound',
  'olympus',
  'wonderland',
  'magic-internet-money',
  'spell-token',
  'ice-token',
  'gala',
  'decentraland',
  'enjincoin',
  'the-sandbox'
];

const getHandleMessage = (contract, msg, sender, amount) => {
  const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
  const msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
    contract,
    msg,
    sender,
    sent_funds
  });

  const msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
    value: message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(msgSend).finish()
  });

  return msgSendAny;
};

const getTxBody = (msgs) => {
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: msgs
  });
};

const getPriceFeedMsg = (url, params, contractAddr, sender) => {
  let payload = Buffer.from(
    JSON.stringify({
      set_state: {
        state: {
          script_url: url,
          parameters: [JSON.stringify(params)],
          language: 'node'
        }
      }
    })
  );
  return getHandleMessage(contractAddr, payload, sender, 0);
};

export default async (yargs: Argv) => {
  const { argv } = yargs;
  const { mnemonic, fees, gas } = argv;
  const childKey = cosmos.getChildKey(mnemonic);
  const sender = cosmos.getAddress(childKey);

  try {
    let msgs = [];
    for (let addrSymbol of addressSymbols) {
      // update markethub implementation
      msgs.push(getPriceFeedMsg(addrSymbol.url, symbols, addrSymbol.address, sender));
    }
    for (let addrId of addressIds) {
      msgs.push(getPriceFeedMsg(addrId.url, ids, addrId.address, sender));
    }

    const txBody = getTxBody(msgs);
    const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);
    console.log(res);
  } catch (error) {
    console.log('error: ', error);
  }
};
