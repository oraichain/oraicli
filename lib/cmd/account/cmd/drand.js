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

// if you're using single file, use global variable nobleBls12381
var test = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(round) {
    var privateKeys, publicKeys, message, signatures2, aggPubKey2, aggSignature2, isCorrect2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            privateKeys = ['18f020b98eb798752a50ed0563b079c125b0db5dd0b1060d1c1b47d4a193e1e4', 'ed69a8c50cf8c9836be3b67c7eeff416612d45ba39a5c099d48fa668bf558c9c', '16ae669f3be7a2121e17d0c68c05a8f3d6bef21ec0f2315f1d7aec12484e4cf5'];
            publicKeys = privateKeys.map(_nobleBls.getPublicKey); // Sign 1 msg with 3 keys

            message = roundToMessage(round);
            _context.next = 5;
            return Promise.all(privateKeys.map(function (p) {
              return (0, _nobleBls.sign)(message, p);
            }));

          case 5:
            signatures2 = _context.sent;
            aggPubKey2 = (0, _nobleBls.aggregatePublicKeys)(publicKeys);
            aggSignature2 = (0, _nobleBls.aggregateSignatures)(signatures2);
            _context.next = 10;
            return (0, _nobleBls.verify)(aggSignature2, message, aggPubKey2);

          case 10:
            isCorrect2 = _context.sent;
            console.log('merged to on publicKey', Buffer.from(aggPubKey2, 'hex').toString('base64'));
            console.log('merged to one signature', Buffer.from(aggSignature2, 'hex').toString('base64'));
            console.log('is correct:', isCorrect2); // const messages = ['d2', '0d98', '05caf3'];
            // // Sign 3 msgs with 3 keys
            // const signatures3 = await Promise.all(privateKeys.map((p, i) => sign(messages[i], p)));
            // const aggSignature3 = aggregateSignatures(signatures3);
            // const isCorrect3 = await verifyBatch(aggSignature3, messages, publicKeys);
            // console.log();
            // console.log('keys', publicKeys);
            // console.log('signatures', signatures3);
            // console.log('merged to one signature', aggSignature3);
            // console.log('is correct:', isCorrect3);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function test(_x) {
    return _ref.apply(this, arguments);
  };
}();

var roundToMessage = function roundToMessage(round, previous_signature, user_input) {
  console.log('user input:', user_input);
  var view = new DataView(new ArrayBuffer(8));
  var roundNum = BigInt(round);
  view.setBigUint64(0, roundNum);
  var buffer = Buffer.from(view.buffer);

  var hash = _crypto["default"].createHash('sha256');

  if (previous_signature) {
    hash.update(Buffer.from(previous_signature, 'base64'));
  }

  hash.update(view);

  if (user_input) {
    hash.update(user_input);
  }

  var message = hash.digest('hex');
  return message;
};

var _default = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(yargs) {
    var _yargs$option$option$, argv, _yield$cosmos$getChil, privateKey, round, previous_signature, user_input, message, publicKey, signature;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _yargs$option$option$ = yargs.option('round', {
              describe: 'the beacon round',
              type: 'string',
              "default": '0'
            }).option('previous_signature', {
              describe: 'the previous round signature',
              type: 'string'
            }).option('user_input', {
              describe: 'unique user input',
              type: 'string'
            }).option('test', {
              describe: 'testing purpose',
              type: 'boolean',
              "default": false
            }), argv = _yargs$option$option$.argv;
            _context2.prev = 1;
            _context2.next = 4;
            return cosmos.getChildKey(argv.mnemonic);

          case 4:
            _yield$cosmos$getChil = _context2.sent;
            privateKey = _yield$cosmos$getChil.privateKey;
            round = argv.round, previous_signature = argv.previous_signature, user_input = argv.user_input;

            if (!argv.test) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", test(round));

          case 9:
            message = roundToMessage(round, previous_signature, user_input);
            publicKey = (0, _nobleBls.getPublicKey)(privateKey);
            _context2.next = 13;
            return (0, _nobleBls.sign)(message, privateKey);

          case 13:
            signature = _context2.sent;
            // console.log('Round', round.toString());
            console.log('publicKey', Buffer.from(publicKey).toString('base64'));
            console.log(Buffer.from(signature, 'hex').toString('base64'));
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 18]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;