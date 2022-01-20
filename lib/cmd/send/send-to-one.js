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

var _dotenv = _interopRequireDefault(require("dotenv"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$option$option, argv, message, address, listMnemonics, i, mnemonic, childKey, sender, res, amount, msgSend, msgSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option$option = yargs.option('address', {
              describe: 'the orai address',
              type: 'string'
            }).option('amount', {
              "default": '1',
              type: 'string'
            }), argv = _yargs$option$option.argv;
            message = _cosmosjs["default"].message;
            address = argv.address;
            console.log('address: ', address);
            cosmos.setBech32MainPrefix('orai');
            listMnemonics = process.env.TEAM_STAKE_MNEMONIC.split(',');
            i = 0;

          case 7:
            if (!(i < listMnemonics.length)) {
              _context.next = 38;
              break;
            }

            mnemonic = listMnemonics[i];
            childKey = cosmos.getChildKey(mnemonic);
            sender = cosmos.getAddress(childKey);
            _context.prev = 11;
            _context.next = 14;
            return cosmos.get("/cosmos/bank/v1beta1/balances/".concat(sender));

          case 14:
            res = _context.sent;
            //console.log(res);
            amount = parseInt(res.balances[0].amount) - 10; // const amount = 1;

            console.log('amount: ', amount);
            msgSend = new message.cosmos.bank.v1beta1.MsgSend({
              from_address: cosmos.getAddress(childKey),
              to_address: argv.address,
              amount: [{
                denom: cosmos.bech32MainPrefix,
                amount: amount.toString()
              }] // 10

            });
            msgSendAny = new message.google.protobuf.Any({
              type_url: '/cosmos.bank.v1beta1.MsgSend',
              value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgSendAny],
              memo: ''
            });
            _context.prev = 20;
            _context.next = 23;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 23:
            response = _context.sent;
            console.log(response);
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](20);
            console.log(_context.t0);

          case 30:
            _context.next = 35;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](11);
            console.log(_context.t1);

          case 35:
            i++;
            _context.next = 7;
            break;

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 32], [20, 27]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;