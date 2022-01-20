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

var _ksuid = _interopRequireDefault(require("ksuid"));

var _long = _interopRequireDefault(require("long"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$pos, argv, req_id, message, childKey, _argv$_$slice, _argv$_$slice2, oscriptName, count, input, expectedOutput, fees, accAddress, msgSend, msgSendAny, txBody, response, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$pos = yargs.positional('oscript-name', {
              describe: 'the oracle script name',
              type: 'string'
            }).positional('validator-count', {
              describe: 'the number of validators',
              type: 'string'
            }).option('fees', {
              describe: 'fees that user is willing to pay',
              type: 'string'
            }), argv = _yargs$positional$pos.argv;
            req_id = _ksuid["default"].randomSync().string;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            _argv$_$slice = argv._.slice(-2), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 2), oscriptName = _argv$_$slice2[0], count = _argv$_$slice2[1];
            input = argv.input, expectedOutput = argv.expectedOutput, fees = argv.fees; // get accAddress in binary

            accAddress = _bech["default"].fromWords(_bech["default"].toWords(childKey.identifier));
            msgSend = new message.oraichain.orai.airequest.MsgSetAIRequest({
              request_id: req_id,
              oracle_script_name: oscriptName,
              creator: accAddress,
              validator_count: new _long["default"](count),
              fees: fees === '' ? '0orai' : fees,
              input: Buffer.from(input),
              expected_output: Buffer.from(expectedOutput)
            });
            msgSendAny = new message.google.protobuf.Any({
              type_url: '/oraichain.orai.airequest.MsgSetAIRequest',
              value: message.oraichain.orai.airequest.MsgSetAIRequest.encode(msgSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgSendAny],
              memo: 'set-aireq'
            });
            _context.prev = 10;
            _context.next = 13;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', 0, 300000);

          case 13:
            response = _context.sent;
            console.log(response);
            console.log('request id: ', req_id);
            _context.next = 18;
            return cosmos.get("/airesult/fullreq/".concat(req_id));

          case 18:
            data = _context.sent;
            console.log('request full information: ', data);
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](10);
            console.log(_context.t0);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 22]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli airequest set-aireq cv021_os 1 --chain-id $CHAIN_ID --input '{"hash": "QmR27t4rQ8J46T77za9BmguVMapJTWU4ASbBDXSFwFNmGK"}'


exports["default"] = _default;