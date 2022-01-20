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
    var _yargs$positional$pos, argv, message, childKey, _argv$_$slice, _argv$_$slice2, oldName, newName, description, contractAddress, ds, tc, fees, accAddress, msgSend, msgSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$pos = yargs.positional('oldName', {
              describe: 'the old oscript name',
              type: 'string'
            }).positional('newName', {
              describe: 'the new oscript name',
              type: 'string'
            }).positional('description', {
              describe: 'the oscript description',
              type: 'string'
            }).positional('contract', {
              describe: 'the oscript contract address',
              type: 'string'
            }).option('ds', {
              describe: 'data source names',
              type: 'array'
            }).option('tc', {
              describe: 'test case names',
              type: 'array'
            }).option('fees', {
              describe: 'the transaction fees',
              type: 'string'
            }), argv = _yargs$positional$pos.argv;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            _argv$_$slice = argv._.slice(-4), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 4), oldName = _argv$_$slice2[0], newName = _argv$_$slice2[1], description = _argv$_$slice2[2], contractAddress = _argv$_$slice2[3];
            ds = argv.ds, tc = argv.tc, fees = argv.fees; // get accAddress in binary

            accAddress = _bech["default"].fromWords(_bech["default"].toWords(childKey.identifier));
            msgSend = new message.oraichain.orai.provider.MsgEditOracleScript({
              old_name: oldName,
              new_name: newName,
              description: description,
              contract: contractAddress,
              owner: accAddress,
              data_sources: ds,
              test_cases: tc,
              fees: fees === '' ? '0orai' : fees
            });
            msgSendAny = new message.google.protobuf.Any({
              type_url: '/oraichain.orai.provider.MsgEditOracleScript',
              value: message.oraichain.orai.provider.MsgEditOracleScript.encode(msgSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgSendAny],
              memo: 'edit-oscript'
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
}(); // yarn oraicli provider set-oscript classification_oscript_2 classification_oscript_2 "test oscript" orai1myee9usysamhfv5nffjs6vvv3zfn2kuy8xamhx --ds classification cv009 --tc classification_testcase


exports["default"] = _default;