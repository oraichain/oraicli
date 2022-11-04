import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 provider <command> [options]')
    .command('create-proposal', 'Create a new proposal for the network', require('./cmd/create-proposal').default)
    .command('create-proposal-cosmjs', 'Create a new proposal for the network cosmjs', require('./cmd/create-proposal-cosmjs').default)
    .command('create-proposal-ibc', 'Create a new proposal for ibc', require('./cmd/create-proposal-ibc').default)
    .command('deposit', 'Deposit funds into the proposal', require('./cmd/deposit').default)
    .command('vote', 'Vote for a proposal', require('./cmd/vote').default)
    .command('latest-proposal', 'Query latest proposal id', require('./cmd/query-latest-proposal').default);
};
