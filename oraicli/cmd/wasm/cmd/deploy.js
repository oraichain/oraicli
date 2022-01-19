import { Argv } from 'yargs';
// import fs from 'fs';
import { upload } from './upload';
import { instantiate } from './instantiate';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('file', {
      describe: 'the smart contract file',
      type: 'string'
    })
    .option('label', {
      describe: 'the label of smart contract',
      type: 'string'
    })
    .option('source', {
      describe: 'the source code of the smart contract',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    })
    .option('amount', {
      type: 'string'
    });

  try {
    // update codeId
    argv.codeId = await upload(argv);
    const address = await instantiate(argv);
    console.log('contract address: ', address);
  } catch (error) {
    console.log('error: ', error);
  }
  // fs.writeFileSync('./address.txt', address);
};

// yarn oraicli wasm deploy ../oraiwasm/smart-contracts/classification/artifacts/classification.wasm --label "classification 14" --input '{}'
