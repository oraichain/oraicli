"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

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

var getOffset = function getOffset(contract, id, creator) {
  return {
    contract: contract,
    token_id: id,
    creator: creator
  };
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, childKey, sender, _yield$cosmos$get, data, finalElement, input, temp;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }).option('market', {
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            console.log("".concat(cosmos.url, "/wasm/v1beta1/contract/").concat(address, "/smart/").concat(Buffer.from(argv.input).toString('base64')));
            _context.next = 7;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(argv.input).toString('base64')));

          case 7:
            _yield$cosmos$get = _context.sent;
            data = _yield$cosmos$get.data;

          case 9:
            if (!true) {
              _context.next = 28;
              break;
            }

            finalElement = data[0];
            input = JSON.stringify({
              ai_royalty: {
                get_royalties: {
                  offset: finalElement ? getOffset(finalElement.contract_addr, finalElement.token_id, finalElement.creator) : null
                }
              }
            });
            _context.next = 14;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(input).toString('base64')));

          case 14:
            temp = _context.sent;
            console.log('temp: ', temp);

            if (!(temp.data.length === 0)) {
              _context.next = 20;
              break;
            }

            _context.next = 19;
            return recoverData(data, sender, childKey, finalElement, argv);

          case 19:
            return _context.abrupt("break", 28);

          case 20:
            data = data.concat(temp.data);
            data = (0, _toConsumableArray2["default"])(new Set(data));

            if (!(data.length > 100)) {
              _context.next = 26;
              break;
            }

            _context.next = 25;
            return recoverData(data, sender, childKey, finalElement, argv);

          case 25:
            data = _context.sent;

          case 26:
            _context.next = 9;
            break;

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;

var recoverData = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data, sender, childKey, finalElement, argv) {
    var input, txBody, res;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('data length: ', data.length);
            input = Buffer.from(JSON.stringify({
              update_royalties: {
                royalty: data
              }
            }));
            txBody = getHandleMessage(argv.market, input, sender, null);
            _context2.prev = 3;
            _context2.next = 6;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

          case 6:
            res = _context2.sent;
            console.log(res);
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](3);
            console.log('error: ', _context2.t0);

          case 13:
            data = [finalElement];
            return _context2.abrupt("return", data);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 10]]);
  }));

  return function recoverData(_x2, _x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();