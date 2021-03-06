import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import { getPublicKey, sign, aggregatePublicKeys, aggregateSignatures, verify } from 'noble-bls12-381';
import crypto from 'crypto';

// if you're using single file, use global variable nobleBls12381

const test = async (round) => {
  const privateKeys = [
    '18f020b98eb798752a50ed0563b079c125b0db5dd0b1060d1c1b47d4a193e1e4',
    'ed69a8c50cf8c9836be3b67c7eeff416612d45ba39a5c099d48fa668bf558c9c',
    '16ae669f3be7a2121e17d0c68c05a8f3d6bef21ec0f2315f1d7aec12484e4cf5'
  ];

  const publicKeys = privateKeys.map(getPublicKey);

  // Sign 1 msg with 3 keys
  const message = roundToMessage(round);
  const signatures2 = await Promise.all(privateKeys.map((p) => sign(message, p)));
  const aggPubKey2 = aggregatePublicKeys(publicKeys);
  const aggSignature2 = aggregateSignatures(signatures2);
  const isCorrect2 = await verify(aggSignature2, message, aggPubKey2);

  console.log('merged to on publicKey', Buffer.from(aggPubKey2, 'hex').toString('base64'));
  console.log('merged to one signature', Buffer.from(aggSignature2, 'hex').toString('base64'));
  console.log('is correct:', isCorrect2);

  // const messages = ['d2', '0d98', '05caf3'];
  // // Sign 3 msgs with 3 keys
  // const signatures3 = await Promise.all(privateKeys.map((p, i) => sign(messages[i], p)));
  // const aggSignature3 = aggregateSignatures(signatures3);
  // const isCorrect3 = await verifyBatch(aggSignature3, messages, publicKeys);
  // console.log();
  // console.log('keys', publicKeys);
  // console.log('signatures', signatures3);
  // console.log('merged to one signature', aggSignature3);
  // console.log('is correct:', isCorrect3);
};

const roundToMessage = (round, previous_signature, user_input) => {
  console.log('user input:', user_input);
  const view = new DataView(new ArrayBuffer(8));
  const roundNum = BigInt(round);
  view.setBigUint64(0, roundNum);
  let buffer = Buffer.from(view.buffer);
  const hash = crypto.createHash('sha256');
  if (previous_signature) {
    hash.update(Buffer.from(previous_signature, 'base64'));
  }
  hash.update(view);
  if (user_input) {
    hash.update(user_input);
  }
  const message = hash.digest('hex');
  return message;
};

export default async (yargs: Argv) => {
  const { argv } = yargs
    .option('round', {
      describe: 'the beacon round',
      type: 'string',
      default: '0'
    })
    .option('previous_signature', {
      describe: 'the previous round signature',
      type: 'string'
    })
    .option('user_input', {
      describe: 'unique user input',
      type: 'string'
    })
    .option('test', {
      describe: 'testing purpose',
      type: 'boolean',
      default: false
    });

  try {
    const { privateKey } = await cosmos.getChildKey(argv.mnemonic);
    const { round, previous_signature, user_input } = argv;
    if (argv.test) {
      return test(round);
    }
    const message = roundToMessage(round, previous_signature, user_input);
    const publicKey = getPublicKey(privateKey);
    const signature = await sign(message, privateKey);
    // console.log('Round', round.toString());
    console.log('publicKey', Buffer.from(publicKey).toString('base64'));
    console.log(Buffer.from(signature, 'hex').toString('base64'));
  } catch (ex) {
    console.log(ex);
  }
};
