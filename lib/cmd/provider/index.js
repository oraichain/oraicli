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
            yargs.usage('usage: $0 provider <command> [options]').command('set-datasource', 'Set a new data source into the system', require('./cmd/set-datasource')["default"]).command('set-testcase', 'Set a new test case into the system', require('./cmd/set-testcase')["default"]).command('edit-datasource', 'Edit a data source in the system', require('./cmd/edit-datasource')["default"]).command('edit-testcase', 'Edit a test case in the system', require('./cmd/edit-testcase')["default"]).command('set-oscript', 'Set an oracle script in the system', require('./cmd/set-oscript')["default"]).command('edit-oscript', 'Edit an oracle script in the system', require('./cmd/edit-oscript')["default"]).command('get-script', 'Get script infomation', require('./cmd/get-script')["default"]).command('decode-tx', 'Decode transaction infomation', require('./cmd/decode-tx')["default"]);

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