import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';
import assert from 'assert';
import fs from 'fs';
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
  // make sure the list is unique
  accs = [...new Set(await getAccounts())];

  // filter delegators so that it is unique and validators cannot be in this array
  console.log(accs.length);
  // delegators also include validators because validators also delegate to their nodes, so we keep this array to quickly filter the accs array
  delegatorAccs = [...new Set(delegatorAccs)];
  // filter all validators
  let filteredDelegatorAccs = delegatorAccs.filter(val => !valAccs.includes(val));

  // all validators should be delegators as well, if not => error
  assert(filteredDelegatorAccs.length + valAccs.length === delegatorAccs.length);
  // console.log("val accs: ", valAccs);
  // set balances to validators. Because accs have no duplicate address => when filter, get the first item of the new array
  valAccs = valAccs.map(valAcc => accs.filter(acc => acc.address === valAcc)[0])
  console.log(accs.length, valAccs.length, delegatorAccs.length);

  // set balance to delegators
  filteredDelegatorAccs = filteredDelegatorAccs.map(delegatorAcc => accs.filter(acc => acc.address === delegatorAcc)[0]);

  // filter accounts to remove all delegators & validators
  let accsLen = accs.length;
  accs = accs.filter(acc => !delegatorAccs.some(delegatorAcc => delegatorAcc === acc.address));

  // all regular holders should not be in the list of validators & delegators
  assert(accs.length + delegatorAccs.length === accsLen);
  console.log(accs.length, valAccs.length, filteredDelegatorAccs.length);

  // collect transactions with memo to again filter the list
  let mappingList = await getMappingAddress();
  console.log("mapping list: ", mappingList.length);
  // final filter to add bsc address into the list of accs with new balances
  valAccs = addBscAddr(valAccs, mappingList, "validator");
  filteredDelegatorAccs = addBscAddr(filteredDelegatorAccs, mappingList, "delegator");
  accs = addBscAddr(accs, mappingList, "regular");
  console.log(accs.length, valAccs.length, filteredDelegatorAccs.length);

  // write to files to take snapshot
  // write to files to take snapshot
  if (!fs.existsSync('./airi-snapshot')) fs.mkdirSync('./airi-snapshot');
  fs.writeFileSync('./airi-snapshot/validators.json', JSON.stringify(valAccs));
  fs.writeFileSync('./airi-snapshot/delegators.json', JSON.stringify(filteredDelegatorAccs));
  fs.writeFileSync('./airi-snapshot/regular.json', JSON.stringify(accs));

  let mergeAccs = accs.concat(valAccs).concat(filteredDelegatorAccs);
  console.log("merge accs length: ", mergeAccs.length);
  assert(mergeAccs.length, accs.length + valAccs.length + filteredDelegatorAccs.length);
  fs.writeFileSync('./airi-snapshot/all-accs.json', JSON.stringify(mergeAccs));
};

const getAccounts = async () => {
  let page = 1;
  let all = [];
  let responses = {};
  do {
    try {
      responses = await fetch(`${scanUrl}/accounts?page_id=${page}`).then(data => data.json());
      if (responses.data) {
        for (let data of responses.data) {
          // auto ignore 
          if (data.balance === 0) continue;
          let balance = data.balance / 10 ** 6;
          all.push({ address: data.address, balance, multipliedBalance: balance });
        }
      }
      console.log("page: ", page);
      page += 1;
    } catch (error) {
      console.log(error);
      continue;
    }
  } while (page <= responses.page.total_page)
  return all;
}

const getMappingAddress = async () => {
  let offset = 0;
  let list = [];
  let responses = {};
  do {
    try {
      responses = await cosmos.get(`/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27orai1hz08wrlkrl37gwhqpxpkynmw8juad72pxp0e94%27&order_by=2&pagination.offset=${offset}`);
      if (responses.code) break;
      let { total } = responses.pagination;
      list = list.concat(parseMemo(responses.tx_responses));
      offset += 100;
    } catch (error) {
      console.log(error);
      continue;
    }
  } while (responses.code === undefined)
  // remove duplicate objects to verify if the snapshot did correctly
  return list;
}

const parseMemo = (txResponses) => {
  let list = [];
  for (let data of txResponses) {
    try {
      let { memo } = data.tx.body;
      let address = data.tx.body.messages[0].from_address;
      // always get the first element, if cannot get => wrong format, and we ignore it
      let bscAddr = memo.split(' ')[0];
      // if length is not correct => ignore
      if (!isAddress(bscAddr)) continue;

      list.push({ bscAddr, address });
    } catch (error) {
      console.log("error parsing memo: ", error);
      continue;
    }
  }
  return list;
}

const addBscAddr = (accs, bscList, type) => {
  accs = accs.filter(acc => bscList.some(element => element.address === acc.address));
  switch (type) {
    case "validator":
      return accs.map(acc => ({ ...acc, bscAddr: bscList.filter(bsc => bsc.address === acc.address).slice(-1)[0].bscAddr, multipliedBalance: acc.balance * 8 }));
    case "delegator":
      return accs.map(acc => ({ ...acc, bscAddr: bscList.filter(bsc => bsc.address === acc.address).slice(-1)[0].bscAddr, multipliedBalance: acc.balance * 4 }));
      break;
    default:
      return accs.map(acc => ({ ...acc, bscAddr: bscList.filter(bsc => bsc.address === acc.address).slice(-1)[0].bscAddr, multipliedBalance: acc.balance }));
      break;
  }
}

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
  // Check each case
  address = address.replace('0x', '');
  var addressHash = sha3(address.toLowerCase());
  for (var i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
      return false;
    }
  }
  return true;
};