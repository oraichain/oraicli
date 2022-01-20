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

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

_dotenv["default"].config({
  silent: process.env.NODE_ENV === 'development'
});

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional, argv, cosmos, _argv$_$slice, _argv$_$slice2, address, listMnemonics, total, i, sender, childKey, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional = yargs.positional('address', {
              describe: 'the orai address',
              type: 'string'
            }), argv = _yargs$positional.argv;
            cosmos = new _cosmosjs["default"](argv.url, argv.chainId);
            cosmos.setBech32MainPrefix('orai');
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            listMnemonics = process.env.TEAM_STAKE_MNEMONIC.split(",");
            total = 0;
            i = 0;

          case 7:
            if (!(i < listMnemonics.length)) {
              _context.next = 25;
              break;
            }

            sender = cosmos.getAddress(listMnemonics[i]);
            childKey = cosmos.getChildKey(listMnemonics[i]);
            _context.prev = 10;
            _context.next = 13;
            return fetch("".concat(argv.url, "/cosmos/bank/v1beta1/balances/").concat(sender)).then(function (res) {
              return res.json();
            });

          case 13:
            data = _context.sent;
            console.log(data);
            total += parseInt(data.balances[0].amount);
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](10);
            console.log(_context.t0);

          case 21:
            console.log("sender: ", sender);

          case 22:
            i++;
            _context.next = 7;
            break;

          case 25:
            console.log("total: ", total);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 18]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;