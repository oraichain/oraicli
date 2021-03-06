import { Argv } from 'yargs';

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('address', {
    describe: 'the orai address',
    type: 'string'
  });
  const address = argv._.length > 2 ? argv._.slice(-1)[0] : cosmos.getAddress(argv.mnemonic);
  try {
    const data = await cosmos.get(`/cosmos/bank/v1beta1/balances/${address}`);
    data.address = address;
    console.log(data);
  } catch (ex) {
    console.log(ex);
  }
};
