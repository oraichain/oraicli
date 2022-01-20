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
            yargs.usage('usage: $0 wasm <command> [options]').command('query', 'query a smart contract', require('./cmd/query-smart')["default"]).command('upload', 'upload a smart contract', require('./cmd/upload')["default"]).command('instantiate', 'instantiate a smart contract', require('./cmd/instantiate')["default"]).command('execute', 'execute a smart contract', require('./cmd/execute')["default"]).command('deploy', 'deploy a smart contract', require('./cmd/deploy')["default"]).command('deploy-cosmjs', 'deploy a smart contract using cosmjs', require('./cmd/deploy-cosmjs')["default"]).command('execute-cosmjs', 'execute a smart contract using cosmjs', require('./cmd/execute-cosmjs')["default"]).command('query-cosmjs', 'query a smart contract using cosmjs', require('./cmd/query-cosmjs')["default"]).option('input', {
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