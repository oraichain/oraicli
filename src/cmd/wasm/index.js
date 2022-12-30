import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 wasm <command> [options]')

    .command('upload', 'upload a smart contract', require('./cmd/upload').default)
    .command('instantiate', 'instantiate a smart contract', require('./cmd/instantiate').default)
    .command('deploy', 'deploy a smart contract using cosmjs', require('./cmd/deploy').default)
    .command('migrate', 'migrate a smart contract using cosmjs', require('./cmd/migrate').default)
    .command('execute', 'execute a smart contract using cosmjs', require('./cmd/execute').default)
    .command('migrate', 'migrate a smart contract', require('./cmd/migrate').default)
    .command('query', 'query a smart contract using cosmjs', require('./cmd/query').default)
    .option('admin', {
      describe: 'the admin to migrate smart contract',
      default: '',
      type: 'string'
    })
    .option('input', {
      describe: 'the input to initilize smart contract',
      default: '{}',
      type: 'string'
    });
};
