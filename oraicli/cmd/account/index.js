import { Argv } from 'yargs';
export default async (yargs: Argv) => {
    yargs
        .usage('usage: $0 account <command>')
        .command('create', 'create account', require('./cmd/create').default)
        .command('balance', 'get account balance', require('./cmd/balance').default)
};
