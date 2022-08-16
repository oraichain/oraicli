import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 staking <command> [options]')
    .option('address', {
      describe: 'validator operator address',
      default: '',
      type: 'string'
    })
    .command('get-validators', 'Get a list of validators', require('./cmd/get-validators').default)
    .command('delegate', 'Delegate to a validator', require('./cmd/delegate').default)
    .command('undelegate', 'Undelegate', require('./cmd/undelegate').default)
    .command('withdraw-commission', 'Withdraw commission', require('./cmd/withdraw-commission').default)
    .command('withdraw', 'Withdraw', require('./cmd/withdraw').default);
};
