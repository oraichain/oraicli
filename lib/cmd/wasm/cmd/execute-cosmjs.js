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
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, prefix, denom, wallet, _yield$wallet$getAcco, _yield$wallet$getAcco2, firstAccount, client, input, amount, result;

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
            prefix = process.env.PREFIX || "orai";
            denom = process.env.DENOM || "orai";
            _context.next = 6;
            return _protoSigning.DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
              hdPaths: [(0, _crypto.stringToPath)(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
              prefix: prefix
            });

          case 6:
            wallet = _context.sent;
            _context.next = 9;
            return wallet.getAccounts();

          case 9:
            _yield$wallet$getAcco = _context.sent;
            _yield$wallet$getAcco2 = (0, _slicedToArray2["default"])(_yield$wallet$getAcco, 1);
            firstAccount = _yield$wallet$getAcco2[0];
            console.log("first account: ", firstAccount);
            _context.next = 15;
            return cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL || "https://testnet-rpc.orai.io", wallet, {
              gasPrice: new _stargate.GasPrice(_math.Decimal.fromUserInput("0", 6), denom),
              prefix: prefix
            });

          case 15:
            client = _context.sent;
            input = JSON.parse(argv.input);
            amount = [{
              amount: amount,
              denom: denom
            }];
            _context.next = 20;
            return client.execute(firstAccount.address, address, input);

          case 20:
            result = _context.sent;
            console.log("result: ", result);

          case 22:
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