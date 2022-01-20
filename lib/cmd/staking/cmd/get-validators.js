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

var ignroredList = ['oraivaloper14vcw5qk0tdvknpa38wz46js5g7vrvut8ku5kaa', 'oraivaloper1rqq57xt5r5pnuguffcrltnvkul7n0jdxxdgey0', 'oraivaloper1mxqeldsxg60t2y6gngpdm5jf3k96dnju5el96f'];

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var argv, data, results, index, operator;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            argv = yargs.argv;
            _context.next = 3;
            return cosmos.get("/cosmos/staking/v1beta1/validators");

          case 3:
            data = _context.sent;
            results = data.validators;

            for (index = 0; index < results.length; index++) {
              operator = results[index];

              if (!ignroredList.includes(operator.operator_address)) {
                console.log(operator.operator_address);
                console.log(operator.description.moniker);
                console.log();
              }
            }

          case 6:
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