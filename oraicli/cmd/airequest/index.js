import { Argv } from 'yargs';
export default async (yargs: Argv) => {
    yargs
        .usage('usage: $0 airequest <command> [options]')
        .command('set-aireq', 'create an AI request', require('./cmd/set-aireq').default)
        .command('create-report', 'create an AI report', require('./cmd/create-report').default)
        .option('input', {
            describe: 'the input for the data source',
            default: '{}',
            type: 'string'
        })
        .option('expected-output', {
            describe: 'the expected output for the test case',
            default: '{}',
            type: 'string'
        });
};
