import { Argv } from 'yargs';
export default async (yargs: Argv) => {
    yargs
        .usage('usage: $0 drand <command>')
        .command('demo', 'demo drand with tx and queries', require('./cmd/demo').default)
        .command('get-pubkey', 'get pubkey of vrf members through Oraichain', require('./cmd/get-pubkey').default)
        .command('get-members', 'get vrf members through Oraichain', require('./cmd/get-members').default);
}