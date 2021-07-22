import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import Cosmos from '@oraichain/cosmosjs';

const argv = yargs(hideBin(process.argv))
  .config('env', (path) => {
    const config = dotenv.config({ path }).parsed;
    // global
    global.cosmos = new Cosmos(config.URL || 'https://lcd.orai.io', config.CHAIN_ID || 'Oraichain');
    cosmos.setBech32MainPrefix('orai');
    return { mnemonic: config.SEND_MNEMONIC };
  })
  .default('env', '.env')
  .alias('help', 'h')
  .alias('version', 'v')
  .command('send [address]', 'send orai token', require('./cmd/send/index').default)
  .command('drand', 'drand utility', require('./cmd/drand/index').default)
  .command('send-to-one [address]', 'send orai tokens to one address', require('./cmd/send/send-to-one').default)
  .command('multisend [address]', 'send orai token', require('./cmd/send/multisend').default)
  .command('account', 'account commands', require('./cmd/account').default)
  .command('staking', 'staking commands', require('./cmd/staking').default)
  .command('wasm', 'wasm commands', require('./cmd/wasm').default)
  .command('provider', 'update provider data', require('./cmd/provider').default)
  .command('airequest', 'airequest commands', require('./cmd/airequest').default)
  .command('distr', 'distribution commands', require('./cmd/distr').default)
  .command('ibc', 'ibc commands', require('./cmd/ibc').default)
  .command('airi', 'airi commands', require('./cmd/airi').default)
  .command('proposals', 'prososal commands', require('./cmd/proposal').default)
  .option('memo', {
    default: '',
    type: 'string'
  })
  .option('gas', {
    type: 'number',
    default: 2000000
  }).argv;
