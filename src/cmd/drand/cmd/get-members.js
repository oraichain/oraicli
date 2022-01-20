import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

// TODO: assume members are small, for big one should get 10 by 10
const getMembers = async (address, total) => {
  let offset = '';
  let members = [];
  do {
    const tempMembers = await cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${Buffer.from(JSON.stringify({ get_members: { offset: offset, limit: 5 } })).toString('base64')}`);
    members = members.concat(tempMembers.data);
    offset = members[members.length - 1].address;
    members = members.filter((v, i, a) => a.findIndex((t) => t.address === v.address) === i);
  } while (members.length < total);
  return members;
};

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('address', {
    describe: 'the smart contract address',
    type: 'string'
  });

  const [address] = argv._.slice(-1);
  let data = await getMembers(address, 26);
  data = data.map((member) => ({ address: member.address, shared_row: member.shared_row })).filter((member) => member.shared_row === null);
  console.log('data: ', data);
};
