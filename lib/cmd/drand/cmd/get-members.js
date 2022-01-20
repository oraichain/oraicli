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

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

// TODO: assume members are small, for big one should get 10 by 10
var getMembers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(address, total) {
    var offset, members, tempMembers;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            offset = '';
            members = [];

          case 2:
            _context.next = 4;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(JSON.stringify({
              get_members: {
                offset: offset,
                limit: 5
              }
            })).toString('base64')));

          case 4:
            tempMembers = _context.sent;
            members = members.concat(tempMembers.data);
            offset = members[members.length - 1].address;
            members = members.filter(function (v, i, a) {
              return a.findIndex(function (t) {
                return t.address === v.address;
              }) === i;
            });

          case 8:
            if (members.length < total) {
              _context.next = 2;
              break;
            }

          case 9:
            return _context.abrupt("return", members);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getMembers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$positional, argv, _argv$_$slice, _argv$_$slice2, address, data;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _yargs$positional = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
            }), argv = _yargs$positional.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            _context2.next = 4;
            return getMembers(address, 26);

          case 4:
            data = _context2.sent;
            data = data.map(function (member) {
              return {
                address: member.address,
                shared_row: member.shared_row
              };
            }).filter(function (member) {
              return member.shared_row === null;
            });
            console.log('data: ', data);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;