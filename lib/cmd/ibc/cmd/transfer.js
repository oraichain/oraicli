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

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, message, childKey, sender, address, msgSend, msgSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the recipient address',
              type: 'string'
            }).option('amount', {
              "default": '1',
              type: 'string'
            }).option('timeout', {
              "default": 60,
              type: 'number'
            }).option('port', {
              "default": 'transfer',
              type: 'string'
            }).option('channel', {
              "default": 'channel-0',
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            address = argv._.length > 2 ? argv._.slice(-1)[0] : sender;
            msgSend = new message.ibc.applications.transfer.v1.MsgTransfer({
              source_channel: argv.channel,
              source_port: argv.port,
              sender: sender,
              receiver: address,
              token: {
                denom: cosmos.bech32MainPrefix,
                amount: argv.amount
              },
              timeout_timestamp: (Date.now() + argv.timeout * 1000) * Math.pow(10, 6)
            });
            msgSendAny = new message.google.protobuf.Any({
              type_url: '/ibc.applications.transfer.v1.MsgTransfer',
              value: message.ibc.applications.transfer.v1.MsgTransfer.encode(msgSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgSendAny],
              memo: argv.memo
            });
            _context.prev = 8;
            _context.next = 11;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 11:
            response = _context.sent;
            console.log(response);
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](8);
            console.log(_context.t0);

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
}();

exports["default"] = _default;