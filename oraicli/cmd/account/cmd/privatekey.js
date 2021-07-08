import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs;

  try {
    const childKey = await cosmos.getChildKey(argv.mnemonic);
    console.log(childKey.privateKey.toString('hex'));
  } catch (ex) {
    console.log(ex);
  }
};
