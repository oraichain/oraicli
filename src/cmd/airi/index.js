import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs.usage('usage: $0 airi <command>').command('airi', 'airi snapshot', require('./cmd/airi').default);
};
