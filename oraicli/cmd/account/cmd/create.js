import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
    const { argv } = yargs;

    const mnemonic = cosmos.generateMnemonic(256);
    const address = cosmos.getAddress(mnemonic);
    console.log({ mnemonic, address });
};
