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

var _bech = _interopRequireDefault(require("bech32"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$pos, argv, message, childKey, _argv$_$slice, _argv$_$slice2, oldName, newName, description, contractAddress, fees, accAddress, msgSend, msgSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$pos = yargs.positional('oldName', {
              describe: 'the old datasource name',
              type: 'string'
            }).positional('newName', {
              describe: 'the new datasource name',
              type: 'string'
            }).positional('description', {
              describe: 'the datasource description',
              type: 'string'
            }).positional('contract', {
              describe: 'the datasource contract address',
              type: 'string'
            }).option('fees', {
              describe: 'the transaction fees',
              type: 'string'
            }), argv = _yargs$positional$pos.argv;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            _argv$_$slice = argv._.slice(-4), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 4), oldName = _argv$_$slice2[0], newName = _argv$_$slice2[1], description = _argv$_$slice2[2], contractAddress = _argv$_$slice2[3];
            fees = argv.fees; // get accAddress in binary

            accAddress = _bech["default"].fromWords(_bech["default"].toWords(childKey.identifier));
            msgSend = new message.oraichain.orai.provider.MsgEditAIDataSource({
              old_name: oldName,
              new_name: newName,
              description: description,
              contract: contractAddress,
              owner: accAddress,
              fees: fees === '' ? '0orai' : fees
            });
            msgSendAny = new message.google.protobuf.Any({
              type_url: '/oraichain.orai.provider.MsgEditAIDataSource',
              value: message.oraichain.orai.provider.MsgEditAIDataSource.encode(msgSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgSendAny],
              memo: 'edit-datasource'
            });
            _context.prev = 9;
            _context.next = 12;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 12:
            response = _context.sent;
            console.log(response);
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](9);
            console.log(_context.t0);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 16]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli provider edit-datasource classification classification "test edit data source" orai1myee9usysamhfv5nffjs6vvv3zfn2kuy8xamhx


exports["default"] = _default;