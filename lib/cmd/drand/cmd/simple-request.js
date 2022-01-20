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

var _jsSha = _interopRequireDefault(require("js-sha3"));

var _secp256k = _interopRequireDefault(require("secp256k1"));

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
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, address, childKey, sender, input, txBody, res, round, attributes, aggregateSig, signedSig, _message, hashedMsg, finalHash, pub, isSigned;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('address', {
              describe: 'the smart contract address',
              type: 'string'
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
            round = JSON.parse(res.tx_response.raw_log)[0].events[2].attributes[3].value;
            console.log('round: ', JSON.parse(res.tx_response.raw_log)[0].events[2].attributes[3].value);
            _context.next = 15;
            return checkAggregateSig(round, address);

          case 15:
            attributes = _context.sent;
            aggregateSig = JSON.parse(Buffer.from(attributes[3].value, 'base64').toString());
            console.log('aggregate sig information: ', aggregateSig);
            signedSig = Uint8Array.from(Buffer.from(aggregateSig.signed_sig, 'base64'));
            _message = Uint8Array.from(Buffer.from(aggregateSig.sig, 'base64'));
            hashedMsg = _jsSha["default"].keccak256(_message);
            finalHash = Uint8Array.from(Buffer.from(hashedMsg, 'hex'));
            pub = Uint8Array.from(Buffer.from(aggregateSig.pubkey, 'base64'));
            isSigned = _secp256k["default"].ecdsaVerify(signedSig, finalHash, pub);
            console.log('is signed: ', isSigned);
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](6);
            console.log('error: ', _context.t0);

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 27]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;

var checkAggregateSig = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(round, address) {
    var expectedResult, attributes;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("/cosmos/tx/v1beta1/txs?events=wasm.function_type%3D%27aggregate_sig%27&events=wasm.round%3D%27".concat(round, "%27&events=wasm.contract_address%3D%27").concat(address, "%27"));
            _context2.prev = 1;
            _context2.next = 4;
            return cosmos.get("/cosmos/tx/v1beta1/txs?events=wasm.function_type%3D%27aggregate_sig%27&events=wasm.round%3D%27".concat(round, "%27&events=wasm.contract_address%3D%27").concat(address, "%27"));

          case 4:
            expectedResult = _context2.sent;
            console.log('response: ', expectedResult.tx_responses[0]);
            attributes = JSON.parse(expectedResult.tx_responses[0].raw_log)[0].events[1].attributes;
            return _context2.abrupt("return", attributes);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](1);
            console.log('error: ', _context2.t0);
            _context2.next = 15;
            return sleep(5000);

          case 15:
            _context2.next = 17;
            return checkAggregateSig(round, address);

          case 17:
            return _context2.abrupt("return", _context2.sent);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 10]]);
  }));

  return function checkAggregateSig(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};