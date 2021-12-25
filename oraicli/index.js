import yargs from 'yargs/yargs';
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import Cosmos from '@oraichain/cosmosjs';
import readlineSync from 'readline-sync';
import { decrypt } from './util';

let password;
const decryptMnemonic = (mnemonic) => {
  if (mnemonic && mnemonic.indexOf(' ') === -1) {
    if (!password) {
      password = readlineSync.question('enter passphrase:', { hideEchoBack: true });
    }
    return decrypt(password, mnemonic);
  }
  return mnemonic;
};

const argv = yargs(hideBin(process.argv))
  .config('env', (path) => {
    const config = dotenv.config({ path }).parsed;
    // global
    global.cosmos = new Cosmos(config.URL || 'https://lcd.orai.io', config.CHAIN_ID || 'Oraichain');
    cosmos.setBech32MainPrefix(config.DENOM || 'orai');
    return { mnemonic: decryptMnemonic(config.MNEMONIC || config.SEND_MNEMONIC), minter_mnemonic: decryptMnemonic(config.MINTER_MNEMONIC) };
  })
  .config('file-input', (path) => {
    return { input: fs.readFileSync(path).toString() };
  })
  .default('env', '.env')
  .alias('help', 'h')
  .alias('version', 'v')
  .command('send [address]', 'send token', require('./cmd/send/index').default)
  .command('send-cosmjs [address]', 'send token using cosmjs library', require('./cmd/send/send-cosmjs').default)
  .command('drand', 'drand utility', require('./cmd/drand/index').default)
  .command('send-to-one [address]', 'send tokens to one address', require('./cmd/send/send-to-one').default)
  .command('multisend [address]', 'send token', require('./cmd/send/multisend').default)
  .command('account', 'account commands', require('./cmd/account').default)
  .command('staking', 'staking commands', require('./cmd/staking').default)
  .command('wasm', 'wasm commands', require('./cmd/wasm').default)
  .command('marketplace', 'marketplace commands', require('./cmd/marketplace').default)
  .command('provider', 'update provider data', require('./cmd/provider').default)
  .command('airequest', 'airequest commands', require('./cmd/airequest').default)
  .command('distr', 'distribution commands', require('./cmd/distr').default)
  .command('ibc', 'ibc commands', require('./cmd/ibc').default)
  .command('airi', 'airi commands', require('./cmd/airi').default)
  .command('proposals', 'prososal commands', require('./cmd/proposal').default)
  .command('pricefeed', 'pricefeed commands', require('./cmd/pricefeed').default)
  .option('memo', {
    default: '',
    type: 'string'
  })
  .option('gas', {
    type: 'number',
    default: 2000000
  }).argv;
