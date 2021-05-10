import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
const message = Cosmos.message;

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('address', {
    describe: 'the smart contract address',
    type: 'string'
  });
  console.log("input: ", argv.input)

  const [address] = argv._.slice(-1);
  const data = await fetch(`${argv.url}/wasm/v1beta1/contract/${address}/smart/${Buffer.from(argv.input).toString('base64')}`).then((res) => res.json());
  console.log(data);
};
