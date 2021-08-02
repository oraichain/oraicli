import { Argv } from 'yargs';
export default async (yargs: Argv) => {
    yargs
        .usage('usage: $0 account <command>')
        .command('demo', 'demo drand with tx and queries', require('./cmd/demo').default)
        .command('get-pubkey', 'get pubkey of vrf members through Oraichain', require('./cmd/get-pubkey').default)
        .command('simple-request', 'simple request for vrf Oraichain', require('./cmd/simple-request').default)
}