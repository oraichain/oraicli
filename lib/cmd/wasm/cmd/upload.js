"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.upload = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _fs = _interopRequireDefault(require("fs"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var message = _cosmosjs["default"].message;

var getStoreMessage = function getStoreMessage(wasm_byte_code, sender, source) {
  var msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
    wasm_byte_code: wasm_byte_code,
    sender: sender,
    source: source
  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgStoreCode',
    value: message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish()
  });
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

var upload = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    var _argv$_$slice, _argv$_$slice2, file, childKey, sender, gas, source, wasmBody, txBody1, res, codeId;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), file = _argv$_$slice2[0];
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            gas = argv.gas, source = argv.source;
            wasmBody = _fs["default"].readFileSync(file).toString('base64');
            txBody1 = getStoreMessage(wasmBody, sender, source ? _fs["default"].readFileSync(source).toString() : '');
            _context.prev = 6;
            _context.next = 9;
            return cosmos.submit(childKey, txBody1, 'BROADCAST_MODE_BLOCK', !argv.fees ? null : [{
              denom: 'orai',
              amount: argv.fees
            }], gas);

          case 9:
            res = _context.sent;
            // console.log('res: ', res);
            console.log('res: ', res);
            codeId = res.tx_response.logs[0].events[0].attributes.find(function (attr) {
              return attr.key === 'code_id';
            }).value;
            return _context.abrupt("return", codeId);

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](6);
            console.log('error: ', _context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 15]]);
  }));

  return function upload(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.upload = upload;

var _default = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$positional$opt, argv;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('file', {
              describe: 'the smart contract file',
              type: 'string'
            }).option('source', {
              describe: 'the source code of the smart contract',
              type: 'string'
            }).option('fees', {
              describe: 'the transaction fees',
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _context2.next = 3;
            return upload(argv);

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