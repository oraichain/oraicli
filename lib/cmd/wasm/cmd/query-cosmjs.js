"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _protoSigning = require("@cosmjs/proto-signing");

var _stargate = require("@cosmjs/stargate");

var _crypto = require("@cosmjs/crypto");

var cosmwasm = _interopRequireWildcard(require("@cosmjs/cosmwasm-stargate"));

var _math = require("@cosmjs/math");

var _fs = _interopRequireDefault(require("fs"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, client, input, queryResult;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            _context.next = 4;
            return cosmwasm.SigningCosmWasmClient.connect(process.env.RPC_URL || "https://testnet-rpc.orai.io");

          case 4:
            client = _context.sent;
            input = JSON.parse(argv.input);
            _context.next = 8;
            return client.queryContractSmart(address, input);

          case 8:
            queryResult = _context.sent;
            console.log("query result: ", queryResult);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;