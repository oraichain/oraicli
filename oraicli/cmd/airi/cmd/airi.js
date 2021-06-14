import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';
import axios from 'axios';
declare var cosmos: Cosmos;
const scanUrl = process.env.SCAN_URL || "https://api.scan.orai.io/v1";
const lcd = process.env.URL || "https://lcd.orai.io";
const rpc = process.env.RPC || "https://rpc.orai.io";
const ignoredValidators = ["oraivaloper1yvml0getpekwsylk4qr4gx9dauah3ud40gyk03"]

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
  // console.log("res: ", res);
  const validatorList = res.validators;
  for (let validator of validatorList) {

    // blacklisted validators
    if (ignoredValidators.includes(validator.operator_address)) continue;

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

  // console.log("val accs: ", valAccs);
  // set balances to validators. Because accs have no duplicate address => when filter, get the first item of the new array
  valAccs = valAccs.map(valAcc => accs.filter(acc => acc.address === valAcc)[0])
  console.log(accs.length, valAccs.length, delegatorAccs.length);

  // set balance to delegators
  filteredDelegatorAccs = filteredDelegatorAccs.map(delegatorAcc => accs.filter(acc => acc.address === delegatorAcc)[0]);

  // filter accounts to remove all delegators & validators
  accs = [...new Set(accs)].filter(acc => !delegatorAccs.some(delegatorAcc => delegatorAcc === acc.address));
  console.log(accs.length, valAccs.length, filteredDelegatorAccs.length);

  // calculate balances depending on the type of accounts
  valAccs = calculateBalance(valAccs, "validator");
  filteredDelegatorAccs = calculateBalance(filteredDelegatorAccs, "delegator");
  accs = calculateBalance(accs, "regular");
  console.log("validator accs: ", valAccs);

  // collect transactions with memo to again filter the list

  let mappingList = await getMappingAddress();
  console.log("mapping list: ", mappingList.length);
  // final filter to add bsc address into the list of accs
  valAccs = addBscAddr(valAccs, mappingList);
};

const getAccounts = async () => {
  let page = 1;
  let all = [];
  while (true) {
    let responses = await fetch(`${scanUrl}/accounts?page_id=${page}`).then(data => data.json());
    if (page > responses.page.total_page) break;
    if (responses.data) {
      for (let data of responses.data) {
        let balance = data.balance / 10 ** 6;
        all.push({ address: data.address, balance, multipliedBalance: balance });
      }
    }
    console.log("page: ", page);
    page += 1;
  }
  return all;
}

const calculateBalance = (list, type) => {
  switch (type) {
    case "validator":
      list = list.map(element => ({ ...element, multipliedBalance: element.multipliedBalance * 8 }));
      break;
    case "delegator":
      list = list.map(element => ({ ...element, multipliedBalance: element.multipliedBalance * 4 }));
      break;
    default:
      break;
  }
  return list;
}

const getMappingAddress = async () => {
  let offset = 0;
  let list = [];
  while (true) {
    let responses = await cosmos.get(`/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27orai1hz08wrlkrl37gwhqpxpkynmw8juad72pxp0e94%27&order_by=2&pagination.offset=${offset}`);
    if (responses.code) break;
    let { total } = responses.pagination;
    list = list.concat(parseMemo(responses.tx_responses));
    offset += 100;
  }
  return list;
}

const parseMemo = (txResponses) => {
  let list = [];
  for (let data of txResponses) {
    let { memo } = data.tx.body;
    let address = data.tx.body.messages[0].from_address;
    // always get the first element, if cannot get => wrong format, and we ignore it
    let bscAddr = memo.split(' ')[0];
    // if length is not correct => ignore
    if (bscAddr.length !== 42) continue;
    list.push({ bscAddr, address });
  }
  return list;
}

const addBscAddr = (accs, bscList) => {
  accs = accs.filter(acc => bscList.some(element => element.address === acc.address))
    .map(acc =>
      ({ ...acc, bscAddr: bscList.filter(bsc => bsc.address === acc.address)[0].bscAddr }));
  console.log("address after adding bsc and filtering: ", accs.length);
  console.log("length of accs: ", accs);
  return accs;
}

