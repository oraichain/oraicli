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

var _protoSigning = require("@cosmjs/proto-signing");

var _stargate = require("@cosmjs/stargate");

var _crypto = require("@cosmjs/crypto");

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, to_address, denom, wallet, _yield$wallet$getAcco, _yield$wallet$getAcco2, firstAccount, client, amount, result;

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
            denom = process.env.DENOM || "orai";
            _context.next = 5;
            return _protoSigning.DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
              hdPaths: [(0, _crypto.stringToPath)("m/44'/118'/0'/0/0")],
              prefix: denom
            });

          case 5:
            wallet = _context.sent;
            _context.next = 8;
            return wallet.getAccounts();

          case 8:
            _yield$wallet$getAcco = _context.sent;
            _yield$wallet$getAcco2 = (0, _slicedToArray2["default"])(_yield$wallet$getAcco, 1);
            firstAccount = _yield$wallet$getAcco2[0];
            console.log("first account: ", firstAccount);
            _context.next = 14;
            return _stargate.SigningStargateClient.connectWithSigner(process.env.RPC_URL || "https://testnet-rpc.orai.io", wallet);

          case 14:
            client = _context.sent;
            amount = {
              denom: "orai",
              amount: argv.amount
            };
            console.log("amount: ", amount);
            _context.next = 19;
            return client.sendTokens(firstAccount.address, to_address, [amount], {
              amount: [{
                amount: String(0),
                denom: denom
              }],
              gas: "2000000"
            }, "Have fun with your orai coins");

          case 19:
            result = _context.sent;
            console.log("result: ", result);

          case 21:
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