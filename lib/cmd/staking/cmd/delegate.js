"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _bech = _interopRequireDefault(require("bech32"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$option, argv, message, childKey, delegator, address, amount, amountParam, _yield$cosmos$get, balances, msgDelegate, msgDelegateAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option = yargs.option('amount', {
              describe: 'the delegated amount',
              "default": '0',
              type: 'string'
            }), argv = _yargs$option.argv;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            delegator = cosmos.getAddress(argv.mnemonic);
            address = argv.address, amount = argv.amount;

            if (parseInt(amount)) {
              _context.next = 13;
              break;
            }

            _context.next = 8;
            return cosmos.get("/cosmos/bank/v1beta1/balances/".concat(delegator));

          case 8:
            _yield$cosmos$get = _context.sent;
            balances = _yield$cosmos$get.balances;
            amountParam = balances[0];
            _context.next = 14;
            break;

          case 13:
            amountParam = {
              denom: cosmos.bech32MainPrefix,
              amount: amount.toString()
            };

          case 14:
            msgDelegate = new message.cosmos.staking.v1beta1.MsgDelegate({
              delegator_address: delegator,
              validator_address: address,
              amount: amountParam
            });
            console.log('msg delegate: ', msgDelegate);
            msgDelegateAny = new message.google.protobuf.Any({
              type_url: '/cosmos.staking.v1beta1.MsgDelegate',
              value: message.cosmos.staking.v1beta1.MsgDelegate.encode(msgDelegate).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgDelegateAny],
              memo: ''
            });
            _context.prev = 18;
            _context.next = 21;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 21:
            response = _context.sent;
            console.log(response);
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](18);
            console.log(_context.t0);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[18, 25]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli staking delegate --address oraivaloper1x6xl5kls4xkmkv3rst5tndmxtqt0u8dx7e4hn0 --amount 1 --chain-id private-Oraichain


exports["default"] = _default;