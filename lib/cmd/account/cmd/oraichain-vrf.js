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

var _nobleBls = require("noble-bls12-381");

var _crypto = _interopRequireDefault(require("crypto"));

var roundToMessage = function roundToMessage(round, previous_signature) {
  var view = new DataView(new ArrayBuffer(8));
  var roundNum = BigInt(round);
  view.setBigUint64(0, roundNum);

  var hash = _crypto["default"].createHash('sha256');

  if (previous_signature) {
    hash.update(Buffer.from(previous_signature, 'base64'));
  }

  hash.update(view);
  var message = hash.digest('hex');
  return message;
};

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
    var _yargs$option$option, argv, _yield$cosmos$getChil, privateKey, address, amount, childKey, sender, publicKey, input, result, _result$data, round, signature, _message, txBody, res, _result;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option$option = yargs.option('address', {
              describe: 'drand address',
              type: 'string',
              "default": ''
            }).option('amount', {
              describe: 'funds to the random contract',
              type: 'string',
              "default": ''
            }), argv = _yargs$option$option.argv;
            _context.prev = 1;
            _context.next = 4;
            return cosmos.getChildKey(argv.mnemonic);

          case 4:
            _yield$cosmos$getChil = _context.sent;
            privateKey = _yield$cosmos$getChil.privateKey;
            address = argv.address, amount = argv.amount;
            childKey = cosmos.getChildKey(argv.mnemonic);
            sender = cosmos.getAddress(childKey);
            publicKey = (0, _nobleBls.getPublicKey)(privateKey);
            console.log('publicKey', Buffer.from(publicKey).toString('base64'));
            console.log('sender: ', sender); // collect current round & previous signature

            input = {
              latest: {}
            };
            _context.next = 15;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(JSON.stringify(input)).toString('base64')));

          case 15:
            result = _context.sent;
            console.log('result: ', result);

            if (result) {
              _context.next = 20;
              break;
            }

            console.error('result is invalid');
            return _context.abrupt("return");

          case 20:
            _result$data = result.data, round = _result$data.round, signature = _result$data.signature; // +1 for new round, and current signature is previous signature in the next round

            _message = roundToMessage(round + 1, signature);
            _context.next = 24;
            return (0, _nobleBls.sign)(_message, privateKey);

          case 24:
            signature = _context.sent;
            signature = Buffer.from(signature, 'hex').toString('base64'); // console.log('Round', round.toString());

            console.log('new signature: ', signature); // update new randomness

            input = Buffer.from(JSON.stringify({
              add: {
                signature: signature
              }
            }));
            txBody = getHandleMessage(address, input, sender, amount);
            _context.next = 31;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), argv.gas);

          case 31:
            res = _context.sent;
            console.log(res); // if the transaction is successful, we query again to get new random seed

            if (!(res && res.tx_response && res.tx_response.code === 0)) {
              _context.next = 39;
              break;
            }

            input = {
              latest: {}
            };
            _context.next = 37;
            return cosmos.get("/wasm/v1beta1/contract/".concat(address, "/smart/").concat(Buffer.from(JSON.stringify(input)).toString('base64')));

          case 37:
            _result = _context.sent;
            console.log('randomness: ', _result.data.randomness);

          case 39:
            _context.next = 44;
            break;

          case 41:
            _context.prev = 41;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);

          case 44:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 41]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;