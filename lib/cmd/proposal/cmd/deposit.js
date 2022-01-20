"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _bech = _interopRequireDefault(require("bech32"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _long = _interopRequireDefault(require("long"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$option$option, argv, mnemonic, amount, proposal_id, message, childKey, depositor, msgDeposit, msgDepositAny, txBody, res;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option$option = yargs.option('proposal_id', {
              describe: 'proposal id to deposit into',
              type: 'number'
            }).option('amount', {
              describe: 'amount to deposit into',
              type: 'string'
            }), argv = _yargs$option$option.argv;
            mnemonic = argv.mnemonic, amount = argv.amount, proposal_id = argv.proposal_id;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(mnemonic);
            depositor = cosmos.getAddress(childKey);
            msgDeposit = new message.cosmos.gov.v1beta1.MsgDeposit({
              proposal_id: new _long["default"](proposal_id),
              depositor: depositor,
              amount: [{
                denom: cosmos.bech32MainPrefix,
                amount: amount ? amount : '1'
              }]
            });
            msgDepositAny = new message.google.protobuf.Any({
              type_url: '/cosmos.gov.v1beta1.MsgDeposit',
              value: message.cosmos.gov.v1beta1.MsgDeposit.encode(msgDeposit).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgDepositAny]
            });
            _context.prev = 8;
            _context.next = 11;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 11:
            res = _context.sent;
            console.log(res);
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](8);
            console.log('error: ', _context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 15]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // example: yarn oraicli proposals deposit --proposal_id 10 --amount 10000000


exports["default"] = _default;