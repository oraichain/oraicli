import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 marketplace <command> [options]')
    .command('update-storage', 'update storage', require('./cmd/update-storage').default)
    .command('update-royalties', 'update royalties', require('./cmd/update-royalties').default)
    .command('query-pagination', 'update storage', require('./cmd/query-pagination').default)
    .option('input', {
      describe: 'the input to initilize smart contract',
      default: '{}',
      type: 'string'
    });
};
