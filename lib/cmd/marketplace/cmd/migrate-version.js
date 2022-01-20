"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

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

var getNfts = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(owner, address) {
    var offset, url, nfts, data, input;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            offset = null;
            url = cosmos.url;
            nfts = [];
            data = {};

          case 4:
            input = JSON.stringify({
              tokens: {
                owner: owner,
                start_after: offset
              }
            });
            console.log("".concat(url, "/wasm/v1beta1/contract/").concat(address, "/smart/").concat(Buffer.from(input).toString('base64')));
            _context.next = 8;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(input).toString('base64')));

          case 8:
            data = _context.sent;
            nfts = nfts.concat(data.data.tokens);
            console.log('data: ', data.data.tokens);
            console.log('nfts: ', nfts[nfts.length - 1]);
            offset = nfts[nfts.length - 1];

          case 13:
            if (data.data.tokens.length > 0) {
              _context.next = 4;
              break;
            }

          case 14:
            nfts = (0, _toConsumableArray2["default"])(new Set(nfts));
            return _context.abrupt("return", nfts);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getNfts(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, childKey, sender, nfts, input, txBody, res;

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
            return getNfts(address, argv.nftaddr);

          case 6:
            nfts = _context2.sent;
            console.log('nfts: ', JSON.stringify(nfts));
            console.log('nft length: ', nfts.length);
            input = Buffer.from(JSON.stringify({
              migrate_version: {
                nft_contract_addr: argv.nftaddr,
                token_ids: nfts,
                new_marketplace: argv.market
              }
            })); // update nfts

            txBody = getHandleMessage(address, input, sender, argv.amount);
            _context2.prev = 11;
            _context2.next = 14;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

          case 14:
            res = _context2.sent;
            console.log(res);
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](11);
            console.log('error: ', _context2.t0);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[11, 18]]);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;