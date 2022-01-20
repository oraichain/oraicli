"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var message = _cosmosjs["default"].message;

var getHandleMessage = function getHandleMessage(contract, msg, sender, amount) {
  var sent_funds = amount ? [{
    denom: cosmos.bech32MainPrefix,
    amount: amount
  }] : null;
  var msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
    contract: contract,
    msg: msg,
    sender: sender,
    sent_funds: sent_funds
  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
    value: message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(msgSend).finish()
  });
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

var getRoyalties = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(address, nftAddr) {
    var offset, url, royalties, data, input;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            offset = null;
            url = cosmos.url;
            royalties = [];
            data = {};

          case 4:
            input = JSON.stringify({
              msg: {
                get_royalties_contract: {
                  contract_addr: nftAddr,
                  offset: offset,
                  limit: 30,
                  order: 1
                }
              }
            });
            console.log('input: ', input);
            console.log("".concat(url, "/wasm/v1beta1/contract/").concat(address, "/smart/").concat(Buffer.from(input).toString('base64')));
            _context.next = 9;
            return fetch("".concat(url, "/wasm/v1beta1/contract/").concat(address, "/smart/").concat(Buffer.from(input).toString('base64'))).then(function (data) {
              return data.json();
            });

          case 9:
            data = _context.sent;
            royalties = royalties.concat(data.data);
            console.log('data: ', data.data);
            console.log('royalties: ', royalties[royalties.length - 1]);
            offset = {
              contract: royalties[royalties.length - 1].contract_addr,
              token_id: royalties[royalties.length - 1].token_id,
              creator: royalties[royalties.length - 1].creator
            };

          case 14:
            if (data.data.length > 0) {
              _context.next = 4;
              break;
            }

          case 15:
            royalties = royalties.filter(function (v, i, a) {
              return a.findIndex(function (t) {
                return t.token_id === v.token_id;
              }) === i;
            });
            return _context.abrupt("return", royalties);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getRoyalties(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, childKey, sender, royalties, input, txBody, res;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }).option('market', {
              type: 'string'
            }).option('nftaddr', {
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            _context2.next = 6;
            return getRoyalties(address, argv.nftaddr);

          case 6:
            royalties = _context2.sent;
            // royalties = royalties.map(r => ({ ...r, royalty: r.royalty * Math.pow(10, 7) > Math.pow(10, 9) ? r.royalty : r.royalty * Math.pow(10, 7) }));
            // royalties = royalties.filter(r => r.creator_type === "provider");
            royalties = royalties.filter(function (r) {
              return r.royalty * Math.pow(10, 7) < Math.pow(10, 9);
            });
            royalties = royalties.map(function (r) {
              return _objectSpread(_objectSpread({}, r), {}, {
                royalty: r.royalty * Math.pow(10, 7)
              });
            });
            royalties = royalties.filter(function (r) {
              return r.royalty !== 0;
            });
            console.log('royalties: ', JSON.stringify(royalties));
            console.log('royalty length: ', royalties.length);
            input = Buffer.from(JSON.stringify({
              update_royalties: {
                royalty: royalties
              }
            })); // update royalties

            txBody = getHandleMessage(argv.market, input, sender, argv.amount);
            _context2.prev = 14;
            _context2.next = 17;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

          case 17:
            res = _context2.sent;
            console.log(res);
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](14);
            console.log('error: ', _context2.t0);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[14, 21]]);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;