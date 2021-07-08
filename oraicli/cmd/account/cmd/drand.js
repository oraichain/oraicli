import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import { getPublicKey, sign, aggregatePublicKeys, aggregateSignatures, verify } from 'noble-bls12-381';
import crypto from 'crypto';

// if you're using single file, use global variable nobleBls12381

// You can use Uint8Array, or hex string for readability

const roundToMessage = (round, previous_signature) => {
  const view = new DataView(new ArrayBuffer(8));
  const roundNum = BigInt(round);
  view.setBigUint64(0, roundNum);
  let buffer = Buffer.from(view.buffer);
  const hash = crypto.createHash('sha256');
  if (previous_signature) {
    hash.update(Buffer.from(previous_signature, 'base64'));
  }
  hash.update(view);
  const message = hash.digest('hex');
  return message;
};

declare var cosmos: Cosmos;

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
    });

  try {
    const { privateKey } = await cosmos.getChildKey(argv.mnemonic);
    const { round, previous_signature } = argv;

    const message = roundToMessage(round, previous_signature);
    const publicKey = getPublicKey(privateKey);
    const signature = await sign(message, privateKey);
    console.log('Round', round.toString());
    console.log('publicKey', Buffer.from(publicKey).toString('base64'));
    console.log('signature', Buffer.from(signature, 'hex').toString('base64'));
  } catch (ex) {
    console.log(ex);
  }
};

const test = async () => {
  const privateKeys = [
    '18f020b98eb798752a50ed0563b079c125b0db5dd0b1060d1c1b47d4a193e1e4',
    'ed69a8c50cf8c9836be3b67c7eeff416612d45ba39a5c099d48fa668bf558c9c',
    '16ae669f3be7a2121e17d0c68c05a8f3d6bef21ec0f2315f1d7aec12484e4cf5'
  ];

  const publicKeys = privateKeys.map(getPublicKey);

  // Sign 1 msg with 3 keys
  const message = roundToMessage(1);
  const signatures2 = await Promise.all(privateKeys.map((p) => sign(message, p)));
  const aggPubKey2 = aggregatePublicKeys(publicKeys);
  const aggSignature2 = aggregateSignatures(signatures2);
  const isCorrect2 = await verify(aggSignature2, message, aggPubKey2);
  console.log();
  console.log('merged to on publicKey', aggPubKey2);
  console.log('merged to one signature', aggSignature2);
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
