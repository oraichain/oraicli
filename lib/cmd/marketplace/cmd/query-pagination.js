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

var _crypto = _interopRequireDefault(require("crypto"));

var message = _cosmosjs["default"].message;

var getOffset = function getOffset(contract, id, creator) {
  return {
    contract: contract,
    token_id: id,
    creator: creator
  };
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, childKey, sender, offset, input, _yield$cosmos$get, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            offset = getOffset('orai1dcr90cpandxqjqxgx8xxrhlt9r8sywatsr7v2l', '1267', 'orai16xj6keqd4dmaeq6argj2py4l346yldknkg3lg8');
            console.log('offset: ', offset);
            input = JSON.stringify({
              ai_royalty: {
                get_royalties: {
                  offset: offset,
                  limit: 50
                }
              }
            });
            console.log("".concat(cosmos.url, "/wasm/v1beta1/contract/").concat(address, "/smart/").concat(Buffer.from(input).toString('base64')));
            _context.next = 10;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(input).toString('base64')));

          case 10:
            _yield$cosmos$get = _context.sent;
            data = _yield$cosmos$get.data;
            // console.log("data: ", data);
            console.log('data: ', data.length);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // offering: orai109pfqmlv7cq8csv7gml40vsxkm563qyva5p0jr
// royalty: orai1ez6aay60j9kvtn9vmdssjtty9agmzhrdc6nh4a


exports["default"] = _default;