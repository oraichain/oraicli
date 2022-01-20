import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs.usage('usage: $0 ibc <command>').command('transfer', 'transfer fungible token', require('./cmd/transfer').default);
};
