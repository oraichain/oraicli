// @flow
import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';

export default async () => {
  const data = await cosmos.get(`/cosmos/gov/v1beta1/proposals`);
  console.log(data.proposals[data.proposals.length - 1].proposal_id);
};
