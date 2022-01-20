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

var _bech = _interopRequireDefault(require("bech32"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, message, sender, childKey, _argv$_$slice, _argv$_$slice2, amount, receivers, receiverAmounts, totalAmount, i, inputs, outputs, _i, output, msgMultiSend, msgMultiSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('amount', {
              "default": '10',
              type: 'string'
            }).option('receivers', {
              type: 'array'
            }).option('receiver-amounts', {
              type: 'array'
            }), argv = _yargs$positional$opt.argv;
            message = _cosmosjs["default"].message;
            sender = cosmos.getAddress(argv.mnemonic);
            childKey = cosmos.getChildKey(argv.mnemonic);
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), amount = _argv$_$slice2[0];
            receivers = argv.receivers, receiverAmounts = argv.receiverAmounts;
            totalAmount = 0;

            for (i = 0; i < receiverAmounts.length; i++) {
              totalAmount += receiverAmounts[i];
            }

            if (!(amount !== totalAmount)) {
              _context.next = 11;
              break;
            }

            console.log('sending amount must be equal to total receive amounts');
            return _context.abrupt("return");

          case 11:
            if (!(receivers.length !== receiverAmounts.length)) {
              _context.next = 14;
              break;
            }

            console.log('total number of receivers does not equal total number of receiver amounts');
            return _context.abrupt("return");

          case 14:
            inputs = [{
              address: sender,
              coins: [{
                denom: cosmos.bech32MainPrefix,
                amount: String(amount)
              }]
            }];
            outputs = [];

            for (_i = 0; _i < receivers.length; _i++) {
              output = {
                address: receivers[_i],
                coins: [{
                  denom: cosmos.bech32MainPrefix,
                  amount: String(receiverAmounts[_i])
                }]
              };
              outputs.push(output);
            }

            msgMultiSend = new message.cosmos.bank.v1beta1.MsgMultiSend({
              inputs: inputs,
              outputs: outputs
            });
            console.log('msg multisend: ', msgMultiSend);
            msgMultiSendAny = new message.google.protobuf.Any({
              type_url: '/cosmos.bank.v1beta1.MsgMultiSend',
              value: message.cosmos.bank.v1beta1.MsgMultiSend.encode(msgMultiSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgMultiSendAny],
              memo: ''
            });
            _context.prev = 21;
            _context.next = 24;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 24:
            response = _context.sent;
            console.log(response);
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](21);
            console.log(_context.t0);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[21, 28]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli multisend 40 --receivers orai14ruagqc8ta5v452207t6n9cyautyjnzl39hrjh orai1nayufsvk9fdwfz5k9ytacl62uf28s4puaz67h8 orai1t5g84uyusz9d8jrpfql99ptg8l75ck3l8rrvd4 --receiver-amounts 10 10 20


exports["default"] = _default;