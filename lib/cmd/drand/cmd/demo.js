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

var message = _cosmosjs["default"].message;

var getHandleMessage = function getHandleMessage(contract, msg, sender, amount) {
  var sent_funds = amount ? [{
    denom: cosmos.bech32MainPrefix,
    amount: amount
  }] : null;
  var msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
    contract: contract,
    msg: msg,
    sender: sender,
    sent_funds: sent_funds
  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
    value: message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(msgSend).finish()
  });
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, childKey, sender, input, txBody, res, queryLatestInput, latest, queryConfig, fees, round, queryRoundInput, roundOutput;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
            }).option('round', {
              describe: 'round of the randomness to query',
              type: 'number',
              "default": 1
            }).option('user_input', {
              describe: 'unique user input',
              type: 'string',
              "default": ''
            }).option('amount', {
              describe: 'fees to update the vrf round',
              type: 'string',
              "default": '1'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), address = _argv$_$slice2[0];
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey); // invoke handle message contract to update the randomness value. Min fees is 1orai

            input = Buffer.from(JSON.stringify({
              request_random: {
                input: Buffer.from('hello world').toString('base64')
              }
            }));
            txBody = getHandleMessage(address, input, sender, argv.amount);
            _context.prev = 6;
            _context.next = 9;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

          case 9:
            res = _context.sent;
            console.log(res);
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](6);
            console.log('error: ', _context.t0);

          case 16:
            // query latest random round
            queryLatestInput = JSON.stringify({
              latest_round: {}
            });
            _context.next = 19;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(queryLatestInput).toString('base64')));

          case 19:
            latest = _context.sent;
            console.log('latest round: ', latest); // query current fees required

            queryConfig = JSON.stringify({
              contract_info: {}
            });
            _context.next = 24;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(queryConfig).toString('base64')));

          case 24:
            fees = _context.sent;
            console.log('current contract info: ', fees); // query a specific round information

            round = argv.round ? argv.round : 1;
            queryRoundInput = JSON.stringify({
              get_round: {
                round: round
              }
            });
            _context.next = 30;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(queryRoundInput).toString('base64')));

          case 30:
            roundOutput = _context.sent;
            console.log("round ".concat(round, " information: "), roundOutput);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 13]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;