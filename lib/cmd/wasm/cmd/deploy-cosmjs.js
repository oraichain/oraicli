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
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, to_address, _argv$_$slice3, _argv$_$slice4, file, prefix, denom, wallet, _yield$wallet$getAcco, _yield$wallet$getAcco2, firstAccount, client, wasmBody, uploadResult, codeId, input, instantiateResult;

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
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), to_address = _argv$_$slice2[0];
            _argv$_$slice3 = argv._.slice(-1), _argv$_$slice4 = (0, _slicedToArray2["default"])(_argv$_$slice3, 1), file = _argv$_$slice4[0];
            prefix = process.env.PREFIX || "orai";
            denom = process.env.DENOM || "orai";
            _context.next = 7;
            return _protoSigning.DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
              hdPaths: [(0, _crypto.stringToPath)(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
              prefix: prefix
            });

          case 7:
            wallet = _context.sent;
            _context.next = 10;
            return wallet.getAccounts();

          case 10:
            _yield$wallet$getAcco = _context.sent;
            _yield$wallet$getAcco2 = (0, _slicedToArray2["default"])(_yield$wallet$getAcco, 1);
            firstAccount = _yield$wallet$getAcco2[0];
            console.log("first account: ", firstAccount);
            _context.next = 16;
            return cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL || "https://testnet-rpc.orai.io", wallet, {
              gasPrice: new _stargate.GasPrice(_math.Decimal.fromUserInput("0", 6), denom),
              prefix: prefix
            });

          case 16:
            client = _context.sent;
            wasmBody = _fs["default"].readFileSync(file); // update smart contract to collect code id

            _context.next = 20;
            return client.upload(firstAccount.address, wasmBody, {
              source: ""
            }, "demo upload contract");

          case 20:
            uploadResult = _context.sent;
            console.log("upload result: ", uploadResult);
            codeId = uploadResult.codeId;
            input = JSON.parse(argv.input);
            _context.next = 26;
            return client.instantiate(firstAccount.address, parseInt(codeId), input, "demo contract");

          case 26:
            instantiateResult = _context.sent;
            console.log("instantiate result: ", instantiateResult);

          case 28:
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