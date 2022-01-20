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
    var _yargs$option$option, argv, childKey, ret;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option$option = yargs.option('private', {
              describe: 'show private key',
              type: 'boolean',
              "default": true
            }).option('format', {
              describe: 'format key',
              type: 'string',
              "default": 'base64'
            }), argv = _yargs$option$option.argv;

            try {
              childKey = cosmos.getChildKey(argv.mnemonic);
              ret = {
                pubkey: childKey.publicKey.toString(argv.format)
              };

              if (argv["private"]) {
                ret.privateKey = childKey.privateKey.toString(argv.format);
              }

              console.log(ret);
            } catch (ex) {
              console.log(ex);
            }

          case 2:
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