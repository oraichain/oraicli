import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import { encrypt, decrypt } from 'eciesjs';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
  const { argv } = yargs.option('message', {
    describe: 'the message to encrypt',
    type: 'string'
  });

  try {
    const childKey = cosmos.getChildKey(argv.mnemonic);
    const skHex = childKey.privateKey.toString('hex');
    console.log(skHex);
    // this is done by create a random KeyPair and use Key-Exchange to get the secret to decrypt with AES256
    if (argv.message) {
      const data = Buffer.from(argv.message);
      const pkHex = childKey.publicKey.toString('hex');
      const encrypted = encrypt(pkHex, data);
      console.log(pkHex, decrypt(skHex, encrypted).toString());
    }
  } catch (ex) {
    console.log(ex);
  }
};
