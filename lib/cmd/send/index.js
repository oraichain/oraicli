"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, to_address, message, childKey, address, msgSend, msgSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the orai address',
              type: 'string',
              "default": 'orai1u4jjn7adh46gmtnf2a9tsc2g9nm489d7nuhv8n'
            }).option('amount', {
              "default": '1',
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), to_address = _argv$_$slice2[0];
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            address = cosmos.getAddress(childKey);
            console.log('from: ', address);
            msgSend = new message.cosmos.bank.v1beta1.MsgSend({
              from_address: cosmos.getAddress(childKey),
              to_address: to_address,
              amount: [{
                denom: cosmos.bech32MainPrefix,
                amount: argv.amount
              }] // 10

            });
            msgSendAny = new message.google.protobuf.Any({
              type_url: '/cosmos.bank.v1beta1.MsgSend',
              value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgSendAny],
              memo: argv.memo
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
}();

exports["default"] = _default;