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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$option$option, argv, rewards, sendAddresses, validators, promises;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _yargs$option$option = yargs.option('sendAddresses', {
              describe: 'addresses that have staked into the validators',
              type: 'array',
              "default": process.env.LIST_SEND_ADDRESSES.split(',') || ['orai1k54q0nf5x225wanfwrlrkd2cmzc3pv9yklkxmg']
            }).option('validators', {
              describe: 'list of validators we want to check',
              type: 'array',
              "default": process.env.LIST_VALIDATORS.split(',') || ['oraivaloper1lwsq3768lunk78wdsj836svlfpfs09m3mre3wk']
            }), argv = _yargs$option$option.argv;
            rewards = [];
            sendAddresses = argv.sendAddresses, validators = argv.validators; // map through the send addresses list

            promises = sendAddresses.map( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(list, index) {
                var data;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return cosmos.get("/cosmos/distribution/v1beta1/delegators/".concat(list, "/rewards/").concat(validators[index]));

                      case 2:
                        data = _context.sent;

                        if (!(data.rewards[0] !== undefined)) {
                          _context.next = 5;
                          break;
                        }

                        return _context.abrupt("return", data.rewards[0].amount / 1000000);

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()); // wait until all promises resolve

            _context2.next = 6;
            return Promise.all(promises);

          case 6:
            rewards = _context2.sent;
            rewards = rewards.filter(function (element) {
              return element !== undefined;
            });
            return _context2.abrupt("return", rewards);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;