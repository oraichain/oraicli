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

var _getTotalRewards = _interopRequireDefault(require("./get-total-rewards"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var num = 1000000;
var nativeAddrCol = 'A';
var rewardCol = 'H';

function calculateTotalRewards(sheet) {
  var total = 0.0;

  for (var j = 2; sheet[rewardCol + j.toString()] !== undefined; j++) {
    var amount = Math.round(parseFloat(sheet[rewardCol + j.toString()].v) * num); //let amount = 1;

    console.log('amount: ', amount);
    total += amount;
  }

  return total;
}

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$option$option$, argv, finalReceiveObject, message, mnemonics, rewardFile, book, i, sheet, outputs, total, j, amount, output, _i, childKey, sender, _totalRewards, inputs, _outputs, msgMultiSend, msgMultiSendAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option$option$ = yargs.option('mnemonics', {
              describe: '',
              type: 'array',
              "default": process.env.TEAM_STAKE_MNEMONIC.split(',')
            }).option('rewardFile', {
              describe: '',
              type: 'string'
            }).option('gas-limit', {
              describe: '',
              type: 'string',
              "default": '200000'
            }), argv = _yargs$option$option$.argv;
            finalReceiveObject = {};
            message = _cosmosjs["default"].message;
            mnemonics = argv.mnemonics, rewardFile = argv.rewardFile;
            book = _xlsx["default"].readFile(__dirname + '/' + rewardFile);
            console.log('book sheet name: ', book.Props.SheetNames);

            for (i = 0; i < book.SheetNames.length; i++) {
              sheet = book.Sheets[book.SheetNames[i]];
              outputs = [];
              total = 0.0; // j = 2 because the first row is reserved for sender address

              for (j = 2; sheet[nativeAddrCol + j.toString()] !== undefined; j++) {
                amount = Math.round(parseFloat(sheet[rewardCol + j.toString()].v) * num); //let amount = 1;

                output = {
                  address: sheet[nativeAddrCol + j.toString()].v,
                  coins: [{
                    denom: cosmos.bech32MainPrefix,
                    amount: amount.toString()
                  }]
                };
                outputs.push(output);
                total += sheet[rewardCol + j.toString()].v;
              }

              finalReceiveObject[book.SheetNames[i]] = outputs;
            } // console.log("output length: ", finalReceiveObject[book.SheetNames[0]].length)
            // get first sheet only


            _i = 0;

          case 8:
            if (!(_i < 1)) {
              _context.next = 32;
              break;
            }

            // the first row is reserved for the sender address
            //console.log("mnemonic: ", mnemonics);
            childKey = cosmos.getChildKey(mnemonics[_i]);
            sender = cosmos.getAddress(childKey);
            console.log('sender: ', sender);
            _totalRewards = calculateTotalRewards(book.Sheets[book.SheetNames[_i]]);
            console.log('total rewards: ', _totalRewards / num); // temp reward to test

            inputs = [{
              address: sender,
              coins: [{
                denom: cosmos.bech32MainPrefix,
                amount: String(_totalRewards)
              }]
            }];
            _outputs = finalReceiveObject[book.SheetNames[_i]];
            msgMultiSend = new message.cosmos.bank.v1beta1.MsgMultiSend({
              inputs: inputs,
              outputs: _outputs
            }); // console.log("msg multisend: ", msgMultiSend)

            msgMultiSendAny = new message.google.protobuf.Any({
              type_url: '/cosmos.bank.v1beta1.MsgMultiSend',
              value: message.cosmos.bank.v1beta1.MsgMultiSend.encode(msgMultiSend).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgMultiSendAny],
              memo: ''
            });
            _context.prev = 19;
            _context.next = 22;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees), parseInt(700910));

          case 22:
            response = _context.sent;
            console.log(response);
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](19);
            console.log(_context.t0);

          case 29:
            _i++;
            _context.next = 8;
            break;

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[19, 26]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli distr send-rewards --rewardFile reward.xlsx


exports["default"] = _default;