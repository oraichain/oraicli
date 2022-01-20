"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _upload = require("./upload");

var _instantiate = require("./instantiate");

// import fs from 'fs';
var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, address;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('file', {
              describe: 'the smart contract file',
              type: 'string'
            }).option('label', {
              describe: 'the label of smart contract',
              type: 'string'
            }).option('source', {
              describe: 'the source code of the smart contract',
              type: 'string'
            }).option('fees', {
              describe: 'the transaction fees',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _context.prev = 1;
            _context.next = 4;
            return (0, _upload.upload)(argv);

          case 4:
            argv.codeId = _context.sent;
            _context.next = 7;
            return (0, _instantiate.instantiate)(argv);

          case 7:
            address = _context.sent;
            console.log('contract address: ', address);
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](1);
            console.log('error: ', _context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 11]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli wasm deploy ../oraiwasm/smart-contracts/classification/artifacts/classification.wasm --label "classification 14" --input '{}'


exports["default"] = _default;