import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 wasm <command> [options]')
    .command('query', 'query a smart contract', require('./cmd/query-smart').default)
    .command('upload', 'upload a smart contract', require('./cmd/upload').default)
    .command('instantiate', 'instantiate a smart contract', require('./cmd/instantiate').default)
    .command('execute', 'execute a smart contract', require('./cmd/execute').default)
    .command('deploy', 'deploy a smart contract', require('./cmd/deploy').default)
    .command('upload', 'upload a smart contract source code', require('./cmd/upload').default)
    .command('migrate', 'migrate a smart contract to a new source code', require('./cmd/migrate-contract').default)
    .command('deploy-cosmjs', 'deploy a smart contract using cosmjs', require('./cmd/deploy-cosmjs').default)
    .command('execute-cosmjs', 'execute a smart contract using cosmjs', require('./cmd/execute-cosmjs').default)
    .command('query-cosmjs', 'query a smart contract using cosmjs', require('./cmd/query-cosmjs').default)
    .option('input', {
      describe: 'the input to initilize smart contract',
      default: '{}',
      type: 'string'
    });
};
