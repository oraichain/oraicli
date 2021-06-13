import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';
import axios from 'axios';
declare var cosmos: Cosmos;
const scanUrl = process.env.SCAN_URL || "https://api.scan.orai.io/v1";
const lcd = process.env.URL || "https://lcd.orai.io";

export default async (yargs: Argv) => {
  const { argv } = yargs;
  const message = Cosmos.message;
  // let accs = [{
  //   "address": "foo",
  //   "balance": 1
  // },
  // {
  //   "address": "bar",
  //   "balance": 2
  // },
  // {
  //   "address": "h",
  //   "balance": 2
  // },
  // {
  //   "address": "z",
  //   "balance": 2
  // }];
  // let valAccs = [
  //   {
  //     "address": "h",
  //     "balance": 2
  //   },
  //   {
  //     "address": "z",
  //     "balance": 2
  //   }
  // ];
  // let delegatorAccs = [
  //   {
  //     "address": "bar",
  //     "balance": 2
  //   }
  // ];

  let accs = [];
  let valAccs = [];
  let delegatorAccs = [];
  console.log("cosmos endpoint: ", cosmos.url);
  const res = await cosmos.get("/cosmos/staking/v1beta1/validators");
  console.log("res: ", res);
  const validatorList = res.validators;
  for (let validator of validatorList) {
    // decode operator address to wallet address
    const walletWords = bech32.decode(validator.operator_address).words;
    const walletAddr = bech32.encode(cosmos.bech32MainPrefix, walletWords);
    valAccs.push(walletAddr);
    // console.log("delegators: ", delegators);
    // get delegators of a validator
    let res = await cosmos.get(`/cosmos/staking/v1beta1/validators/${validator.operator_address}/delegations?pagination.limit=1000000000`);
    // console.log("res: ", res.delegation_responses.map(data => data.delegation.delegator_address));
    delegatorAccs = delegatorAccs.concat(res.delegation_responses.map(data => data.delegation.delegator_address));
  }
  accs = await getAccounts();

  // filter delegators so that it is unique and validators cannot be in this array
  console.log(delegatorAccs.length);
  // delegators also include validators because validators also delegate to their nodes, so we keep this array to quickly filter the accs array
  delegatorAccs = [...new Set(delegatorAccs)];
  // filter all validators
  let filteredDelegatorAccs = delegatorAccs.filter(val => !valAccs.includes(val));

  console.log("val accs: ", valAccs);
  // set balances to validators. Because accs have no duplicate address => when filter, get the first item of the new array
  valAccs = valAccs.map(valAcc => accs.filter(acc => acc.address === valAcc)[0])

  console.log(accs.length, valAccs.length, delegatorAccs.length);

  // set balance to delegators
  filteredDelegatorAccs = filteredDelegatorAccs.map(delegatorAcc => accs.filter(acc => acc.address === delegatorAcc)[0]);

  // filter accounts to remove all delegators & validators
  accs = [...new Set(accs)].filter(acc => !delegatorAccs.some(delegatorAcc => delegatorAcc === acc.address));
  console.log(accs.length, valAccs.length, filteredDelegatorAccs.length);
};

const getAccounts = async () => {
  let page = 1;
  let all = [];
  let responses = await fetch(`${scanUrl}/accounts?page_id=${page}`).then(data => data.json());
  while (page <= responses.page.total_page) {
    if (responses.data) {
      for (let data of responses.data) {
        all.push({ address: data.address, balance: data.balance / 10 ** 6 });
      }
    }
    console.log("page: ", page);
    page += 1;
    if (page > responses.page.total_page) break;
    responses = await fetch(`${scanUrl}/accounts?page_id=${page}`).then(data => data.json());
  }
  return all;
}

