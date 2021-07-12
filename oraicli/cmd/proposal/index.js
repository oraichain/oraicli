import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 provider <command> [options]')
    .command(
      'create-proposal',
      'Create a new proposal for the network',
      require('./cmd/create-proposal').default
    )
};
