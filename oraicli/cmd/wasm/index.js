import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 wasm <command> [options]')
    .command('query', 'query a smart contract', require('./cmd/query-smart').default)
    .command('execute', 'execute a smart contract', require('./cmd/execute').default)
    .command('deploy', 'deploy a smart contract', require('./cmd/deploy').default)
    .command('update-storage', 'update storage', require('./cmd/update-storage').default)
    .command('query-pagination', 'update storage', require('./cmd/query-pagination').default)
    .option('input', {
      describe: 'the input to initilize smart contract',
      default: '{}',
      type: 'string'
    });
};
