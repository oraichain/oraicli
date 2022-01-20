"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _bech = _interopRequireDefault(require("bech32"));

var _assert = _interopRequireDefault(require("assert"));

var _sha = _interopRequireDefault(require("crypto-js/sha3"));

var _fs = _interopRequireDefault(require("fs"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var scanUrl = process.env.SCAN_URL || 'https://api.scan.orai.io/v1';
var lcd = process.env.URL || 'https://lcd.orai.io';
var rpc = process.env.RPC || 'https://rpc.orai.io';
var ignoredValidators = ['oraivaloper1yvml0getpekwsylk4qr4gx9dauah3ud40gyk03'];

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var argv, message, accs, valAccs, delegatorAccs, res, validatorList, _iterator, _step, validator, walletWords, walletAddr, _res, filteredDelegatorAccs, accsLen, mappingList, mergeAccs;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            argv = yargs.argv;
            message = _cosmosjs["default"].message; // let accs = [{
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

            accs = [];
            valAccs = [];
            delegatorAccs = [];
            _context.next = 7;
            return cosmos.get('/cosmos/staking/v1beta1/validators');

          case 7:
            res = _context.sent;
            // console.log("res: ", res);
            validatorList = res.validators;
            _iterator = _createForOfIteratorHelper(validatorList);
            _context.prev = 10;

            _iterator.s();

          case 12:
            if ((_step = _iterator.n()).done) {
              _context.next = 25;
              break;
            }

            validator = _step.value;

            if (!ignoredValidators.includes(validator.operator_address)) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("continue", 23);

          case 16:
            // decode operator address to wallet address
            walletWords = _bech["default"].decode(validator.operator_address).words;
            walletAddr = _bech["default"].encode(cosmos.bech32MainPrefix, walletWords);
            valAccs.push(walletAddr); // console.log("delegators: ", delegators);
            // get delegators of a validator

            _context.next = 21;
            return cosmos.get("/cosmos/staking/v1beta1/validators/".concat(validator.operator_address, "/delegations?pagination.limit=1000000000"));

          case 21:
            _res = _context.sent;
            // console.log("res: ", res.delegation_responses.map(data => data.delegation.delegator_address));
            delegatorAccs = delegatorAccs.concat(_res.delegation_responses.map(function (data) {
              return data.delegation.delegator_address;
            }));

          case 23:
            _context.next = 12;
            break;

          case 25:
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](10);

            _iterator.e(_context.t0);

          case 30:
            _context.prev = 30;

            _iterator.f();

            return _context.finish(30);

          case 33:
            _context.t1 = _toConsumableArray2["default"];
            _context.t2 = Set;
            _context.next = 37;
            return getAccounts();

          case 37:
            _context.t3 = _context.sent;
            _context.t4 = new _context.t2(_context.t3);
            accs = (0, _context.t1)(_context.t4);
            // filter delegators so that it is unique and validators cannot be in this array
            console.log(accs.length); // delegators also include validators because validators also delegate to their nodes, so we keep this array to quickly filter the accs array

            delegatorAccs = (0, _toConsumableArray2["default"])(new Set(delegatorAccs)); // filter all validators

            filteredDelegatorAccs = delegatorAccs.filter(function (val) {
              return !valAccs.includes(val);
            }); // all validators should be delegators as well, if not => error

            (0, _assert["default"])(filteredDelegatorAccs.length + valAccs.length === delegatorAccs.length); // console.log("val accs: ", valAccs);
            // set balances to validators. Because accs have no duplicate address => when filter, get the first item of the new array

            valAccs = valAccs.map(function (valAcc) {
              return accs.filter(function (acc) {
                return acc.address === valAcc;
              })[0];
            });
            console.log(accs.length, valAccs.length, delegatorAccs.length); // set balance to delegators

            filteredDelegatorAccs = filteredDelegatorAccs.map(function (delegatorAcc) {
              return accs.filter(function (acc) {
                return acc.address === delegatorAcc;
              })[0];
            }); // filter accounts to remove all delegators & validators

            accsLen = accs.length;
            accs = accs.filter(function (acc) {
              return !delegatorAccs.some(function (delegatorAcc) {
                return delegatorAcc === acc.address;
              });
            }); // all regular holders should not be in the list of validators & delegators

            (0, _assert["default"])(accs.length + delegatorAccs.length === accsLen);
            console.log(accs.length, valAccs.length, filteredDelegatorAccs.length); // collect transactions with memo to again filter the list

            _context.next = 53;
            return getMappingAddress();

          case 53:
            mappingList = _context.sent;
            console.log('mapping list: ', mappingList.length); // final filter to add bsc address into the list of accs with new balances

            valAccs = addBscAddr(valAccs, mappingList, 'validator');
            filteredDelegatorAccs = addBscAddr(filteredDelegatorAccs, mappingList, 'delegator');
            accs = addBscAddr(accs, mappingList, 'regular');
            console.log(accs.length, valAccs.length, filteredDelegatorAccs.length); // write to files to take snapshot
            // write to files to take snapshot

            if (!_fs["default"].existsSync('./airi-snapshot')) _fs["default"].mkdirSync('./airi-snapshot');

            _fs["default"].writeFileSync('./airi-snapshot/validators.json', JSON.stringify(valAccs));

            _fs["default"].writeFileSync('./airi-snapshot/delegators.json', JSON.stringify(filteredDelegatorAccs));

            _fs["default"].writeFileSync('./airi-snapshot/regular.json', JSON.stringify(accs));

            mergeAccs = accs.concat(valAccs).concat(filteredDelegatorAccs);
            console.log('merge accs length: ', mergeAccs.length);
            (0, _assert["default"])(mergeAccs.length, accs.length + valAccs.length + filteredDelegatorAccs.length);

            _fs["default"].writeFileSync('./airi-snapshot/all-accs.json', JSON.stringify(mergeAccs));

          case 67:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 27, 30, 33]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;

var getAccounts = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var page, all, responses, _iterator2, _step2, data, balance;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            page = 1;
            all = [];
            responses = {};

          case 3:
            _context2.prev = 3;
            _context2.next = 6;
            return fetch("".concat(scanUrl, "/accounts?page_id=").concat(page)).then(function (data) {
              return data.json();
            });

          case 6:
            responses = _context2.sent;

            if (!responses.data) {
              _context2.next = 27;
              break;
            }

            _iterator2 = _createForOfIteratorHelper(responses.data);
            _context2.prev = 9;

            _iterator2.s();

          case 11:
            if ((_step2 = _iterator2.n()).done) {
              _context2.next = 19;
              break;
            }

            data = _step2.value;

            if (!(data.balance === 0)) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt("continue", 17);

          case 15:
            balance = data.balance / Math.pow(10, 6);
            all.push({
              address: data.address,
              balance: balance,
              multipliedBalance: balance
            });

          case 17:
            _context2.next = 11;
            break;

          case 19:
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](9);

            _iterator2.e(_context2.t0);

          case 24:
            _context2.prev = 24;

            _iterator2.f();

            return _context2.finish(24);

          case 27:
            console.log('page: ', page);
            page += 1;
            _context2.next = 35;
            break;

          case 31:
            _context2.prev = 31;
            _context2.t1 = _context2["catch"](3);
            console.log(_context2.t1);
            return _context2.abrupt("continue", 35);

          case 35:
            if (page <= responses.page.total_page) {
              _context2.next = 3;
              break;
            }

          case 36:
            return _context2.abrupt("return", all);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 31], [9, 21, 24, 27]]);
  }));

  return function getAccounts() {
    return _ref2.apply(this, arguments);
  };
}();

var getMappingAddress = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var offset, list, responses, total;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            offset = 0;
            list = [];
            responses = {};

          case 3:
            _context3.prev = 3;
            _context3.next = 6;
            return cosmos.get("/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27orai1hz08wrlkrl37gwhqpxpkynmw8juad72pxp0e94%27&order_by=2&pagination.offset=".concat(offset));

          case 6:
            responses = _context3.sent;

            if (!responses.code) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("break", 19);

          case 9:
            total = responses.pagination.total;
            list = list.concat(parseMemo(responses.tx_responses));
            offset += 100;
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](3);
            console.log(_context3.t0);
            return _context3.abrupt("continue", 18);

          case 18:
            if (responses.code === undefined) {
              _context3.next = 3;
              break;
            }

          case 19:
            return _context3.abrupt("return", list);

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 14]]);
  }));

  return function getMappingAddress() {
    return _ref3.apply(this, arguments);
  };
}();

var parseMemo = function parseMemo(txResponses) {
  var list = [];

  var _iterator3 = _createForOfIteratorHelper(txResponses),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var data = _step3.value;

      try {
        var memo = data.tx.body.memo;
        var address = data.tx.body.messages[0].from_address; // always get the first element, if cannot get => wrong format, and we ignore it

        var bscAddr = memo.split(' ')[0]; // if length is not correct => ignore

        if (!isAddress(bscAddr)) continue;
        list.push({
          bscAddr: bscAddr,
          address: address
        });
      } catch (error) {
        console.log('error parsing memo: ', error);
        continue;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return list;
};

var addBscAddr = function addBscAddr(accs, bscList, type) {
  accs = accs.filter(function (acc) {
    return bscList.some(function (element) {
      return element.address === acc.address;
    });
  });

  switch (type) {
    case 'validator':
      return accs.map(function (acc) {
        return _objectSpread(_objectSpread({}, acc), {}, {
          bscAddr: bscList.filter(function (bsc) {
            return bsc.address === acc.address;
          })[0].bscAddr,
          multipliedBalance: acc.balance * 8
        });
      });

    case 'delegator':
      return accs.map(function (acc) {
        return _objectSpread(_objectSpread({}, acc), {}, {
          bscAddr: bscList.filter(function (bsc) {
            return bsc.address === acc.address;
          })[0].bscAddr,
          multipliedBalance: acc.balance * 4
        });
      });
      break;

    default:
      return accs.map(function (acc) {
        return _objectSpread(_objectSpread({}, acc), {}, {
          bscAddr: bscList.filter(function (bsc) {
            return bsc.address === acc.address;
          })[0].bscAddr,
          multipliedBalance: acc.balance
        });
      });
      break;
  }
};
/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */


var isAddress = function isAddress(address) {
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


var isChecksumAddress = function isChecksumAddress(address) {
  // Check each case
  address = address.replace('0x', '');
  var addressHash = (0, _sha["default"])(address.toLowerCase());

  for (var i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i] || parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i]) {
      return false;
    }
  }

  return true;
};