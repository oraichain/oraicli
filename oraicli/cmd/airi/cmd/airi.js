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
  const res = await cosmos.get("/cosmos/staking/v1beta1/validators");
  const validatorList = res.validators;
  for (let validator of validatorList) {
    const walletWords = bech32.decode(validator.operator_address).words;
    const walletAddr = bech32.encode(cosmos.bech32MainPrefix, walletWords);
    valAccs.push(walletAddr);
    // console.log("delegators: ", delegators);
    let res = await cosmos.get(`/cosmos/staking/v1beta1/validators/${validator.operator_address}/delegations?pagination.limit=1000000000`);
    // console.log("res: ", res.delegation_responses.map(data => data.delegation.delegator_address));
    delegatorAccs = delegatorAccs.concat(res.delegation_responses.map(data => data.delegation.delegator_address));
  }
  accs = await getAccounts("/accounts", "address");

  // filter delegators so that it is unique and validators cannot be in this array
  console.log(delegatorAccs.length);
  delegatorAccs = [...new Set(delegatorAccs)];
  // this array will be taken for the final snapshot
  let filteredDelegatorAccs = delegatorAccs.filter(val => !valAccs.includes(val));

  // set balances to validators
  valAccs = valAccs.map(valAcc => accs.filter(acc => acc.address === valAcc)[0])
  console.log("val accs: ", valAccs.length);

  console.log(accs.length, valAccs.length, delegatorAccs.length);

  // set balance to delegators
  delegatorAccs = delegatorAccs.map(delegatorAcc => accs.filter(acc => acc.address === delegatorAcc)[0]);

  // filter accounts
  accs = [...new Set(accs)].filter(acc => !delegatorAccs.some(delegatorAcc => delegatorAcc.address === acc.address));
  console.log(accs.length, valAccs.length, filteredDelegatorAccs.length);
};

const getAccounts = async (path, type) => {
  let page = 1;
  let all = [];
  let responses = await fetch(`${scanUrl}${path}?page_id=${page}`).then(data => data.json());
  while (page <= responses.page.total_page) {
    if (responses.data) {
      for (let data of responses.data) {
        all.push({ address: data[type], balance: data.balance / 10 ** 6 });
      }
    }
    console.log("page: ", page);
    page += 1;
    if (page > responses.page.total_page) break;
    responses = await fetch(`${scanUrl}${path}?page_id=${page}`).then(data => data.json());
  }
  return all;
}

