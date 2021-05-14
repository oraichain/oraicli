// @flow
import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('address', {
    describe: 'the smart contract address',
    type: 'string'
  });
  console.log("input: ", argv.input)

  const [address] = argv._.slice(-1);
  const data = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(argv.input).toString('base64')}`);
  console.log(data.data);
};
