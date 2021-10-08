import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs
    .option('private', {
      describe: 'show private key',
      type: 'boolean',
      default: true
    })
    .option('format', {
      describe: 'format key',
      type: 'string',
      default: 'base64'
    });

  try {
    const childKey = cosmos.getChildKey(argv.mnemonic);
    const ret = { pubkey: childKey.publicKey.toString(argv.format) };
    if (argv.private) {
      ret.privateKey = childKey.privateKey.toString(argv.format);
    }
    console.log(ret);
  } catch (ex) {
    console.log(ex);
  }
};
