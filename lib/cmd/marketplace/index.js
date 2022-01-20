"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            yargs.usage('usage: $0 marketplace <command> [options]').command('update-storage', 'update storage', require('./cmd/update-storage')["default"]).command('update-royalties', 'update royalties', require('./cmd/update-royalties')["default"]).command('query-pagination', 'update storage', require('./cmd/query-pagination')["default"]).command('migrate-version', 'migrate marketplace version', require('./cmd/migrate-version')["default"]).command('migrate-marketplace', 'migrate marketplace version without using too many CLI commands', require('./cmd/migrate-marketplace')["default"]).option('input', {
              describe: 'the input to initilize smart contract',
              "default": '{}',
              type: 'string'
            });

          case 1:
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