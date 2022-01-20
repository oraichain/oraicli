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
    var argv, message, childKey, delegator, address, amount, msg, msgAny, txBody, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            argv = yargs.argv;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            delegator = cosmos.getAddress(argv.mnemonic);
            address = argv.address, amount = argv.amount;
            msg = new message.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward({
              delegator_address: delegator,
              validator_address: address
            });
            console.log('msg withdraw: ', msg);
            msgAny = new message.google.protobuf.Any({
              type_url: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
              value: message.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward.encode(msg).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgAny],
              memo: ''
            });
            _context.prev = 9;
            _context.next = 12;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 12:
            response = _context.sent;
            console.log(response);
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](9);
            console.log(_context.t0);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 16]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli staking delegate --address oraivaloper1x6xl5kls4xkmkv3rst5tndmxtqt0u8dx7e4hn0 --amount 1 --chain-id private-Oraichain


exports["default"] = _default;