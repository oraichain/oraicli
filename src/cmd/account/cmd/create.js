import { Argv } from 'yargs';

export default async (yargs: Argv) => {
  const { argv } = yargs;

  const mnemonic = cosmos.generateMnemonic(256);
  const address = cosmos.getAddress(mnemonic);
  console.log({ mnemonic, address });
};
