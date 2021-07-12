import { Argv } from 'yargs';
export default async (yargs: Argv) => {
  yargs
    .usage('usage: $0 account <command>')
    .command('create', 'create account', require('./cmd/create').default)
    .command('privatekey', 'get private key', require('./cmd/privatekey').default)
    .command('balance', 'get account balance', require('./cmd/balance').default)
    .command('drand', 'create decentralized randomness', require('./cmd/drand').default)
    .command('drand-full', 'full flow creating a decentralized random seed', require('./cmd/drand-full').default);
};
