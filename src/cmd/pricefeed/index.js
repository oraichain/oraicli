import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 marketplace <command> [options]')
    .command('update-pricefeed', 'update pricefeed tokens', require('./cmd/update-pricefeed').default);
};
