"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.instantiate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _fs = _interopRequireDefault(require("fs"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var message = _cosmosjs["default"].message;

var getInstantiateMessage = function getInstantiateMessage(code_id, init_msg, sender) {
  var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var amount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var sent_funds = amount ? [{
    denom: cosmos.bech32MainPrefix,
    amount: amount
  }] : null;
  var msgSend = new message.cosmwasm.wasm.v1beta1.MsgInstantiateContract({
    code_id: code_id,
    init_msg: init_msg,
    label: label,
    sender: sender,
    sent_funds: sent_funds
  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgInstantiateContract',
    value: message.cosmwasm.wasm.v1beta1.MsgInstantiateContract.encode(msgSend).finish()
  });
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

var instantiate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    var gas, source, codeId, childKey, sender, input, txBody2, res, address;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gas = argv.gas, source = argv.source, codeId = argv.codeId;
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            _context.prev = 3;
            // next instantiate code
            input = Buffer.from(argv.input).toString('base64');
            txBody2 = getInstantiateMessage(codeId, input, sender, argv.label);
            _context.next = 8;
            return cosmos.submit(childKey, txBody2, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), gas);

          case 8:
            res = _context.sent;
            console.log(res);
            address = JSON.parse(res.tx_response.raw_log)[0].events[1].attributes[0].value;
            return _context.abrupt("return", address);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](3);
            console.log('error: ', _context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 14]]);
  }));

  return function instantiate(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.instantiate = instantiate;

var _default = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$option$option$, argv;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _yargs$option$option$ = yargs.option('codeid', {
              describe: 'the code id of the smart contract',
              type: 'number'
            }).option('label', {
              describe: 'the label of smart contract',
              type: 'string'
            }).option('fees', {
              describe: 'the transaction fees',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }), argv = _yargs$option$option$.argv;
            _context2.next = 3;
            return instantiate(argv);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;