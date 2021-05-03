import { Argv } from 'yargs';
import dotenv from 'dotenv';
import Cosmos from '@oraichain/cosmosjs';
dotenv.config({ silent: process.env.NODE_ENV === 'development' });

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('address', {
    describe: 'the orai address',
    type: 'string'
  });
  const cosmos = new Cosmos(argv.url, argv.chainId);
  cosmos.setBech32MainPrefix('orai');
  const [address] = argv._.slice(-1);
  const listMnemonics = process.env.TEAM_STAKE_MNEMONIC.split(",");
  let total = 0;
  for (let i = 0; i < listMnemonics.length; i++) {
    const sender = cosmos.getAddress(listMnemonics[i]);
    const childKey = cosmos.getChildKey(listMnemonics[i])
    try {
      const data = await fetch(`${argv.url}/cosmos/bank/v1beta1/balances/${sender}`).then((res) => res.json());
      console.log(data);
      total += parseInt(data.balances[0].amount)
    } catch (ex) {
      console.log(ex);
    }
    console.log("sender: ", sender)

  }
  console.log("total: ", total)
};
