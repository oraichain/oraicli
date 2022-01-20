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

var _fs = _interopRequireDefault(require("fs"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$pos, argv, _argv$_$slice, _argv$_$slice2, script, name, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$pos = yargs.positional('script', {
              describe: 'the script type',
              type: 'string'
            }).positional('name', {
              describe: 'the script name',
              type: 'string'
            }), argv = _yargs$positional$pos.argv;
            _argv$_$slice = argv._.slice(-2), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 2), script = _argv$_$slice2[0], name = _argv$_$slice2[1];
            console.log('script: ', script);
            _context.next = 5;
            return cosmos.get("/provider/".concat(script, "/").concat(name));

          case 5:
            data = _context.sent;
            console.log(data);

            if (data.code === undefined) {
              _fs["default"].writeFileSync('./is_exist.txt', '');
            } else {
              _fs["default"].writeFileSync('./is_exist.txt', data.code.toString());
            }

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli provider get-script datasource nl008


exports["default"] = _default;