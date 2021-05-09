import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import Cosmos from '@oraichain/cosmosjs';

dotenv.config({ silent: process.env.NODE_ENV === 'development' });
// global
global.cosmos = new Cosmos(process.env.URL, process.env.CHAIN_ID || 'Oraichain');
cosmos.setBech32MainPrefix('orai');

const argv = yargs(hideBin(process.argv))
  .alias('help', 'h')
  .alias('version', 'v')
  .command('send [address]', 'send orai token', require('./cmd/send/index').default)
  .command('multisend [address]', 'send orai token', require('./cmd/send/multisend').default)
  .command('balance [address]', 'get orai token balance', require('./cmd/balance').default)
  .command('staking', 'staking commands', require('./cmd/staking').default)
  .command('wasm', 'wasm commands', require('./cmd/wasm').default)
  .command('provider', 'update provider data', require('./cmd/provider').default)
  .command('airequest', 'airequest commands', require('./cmd/airequest').default)
  .command('distr', 'distribution commands', require('./cmd/distr').default)
  .option('gas', {
    type: 'number',
    default: 2000000
  })
  .option('mnemonic', {
    type: 'string',
    default: process.env.SEND_MNEMONIC
  }).argv;
