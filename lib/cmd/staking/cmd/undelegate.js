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

var _bech = _interopRequireDefault(require("bech32"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var argv, message, listMnemonics, _iterator, _step, mnemonic, childKey, delegator, delegations, _iterator2, _step2, delegationObj, delegation, msgDelegate, msgDelegateAny, txBody, response;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            argv = yargs.argv;
            message = _cosmosjs["default"].message;
            listMnemonics = process.env.LIST_SEND_MNEMONIC.split(',');
            _iterator = _createForOfIteratorHelper(listMnemonics);
            _context.prev = 4;

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 48;
              break;
            }

            mnemonic = _step.value;
            childKey = cosmos.getChildKey(mnemonic);
            delegator = cosmos.getAddress(mnemonic);
            console.log('delegator: ', delegator);
            _context.next = 13;
            return cosmos.get("/cosmos/staking/v1beta1/delegations/".concat(delegator));

          case 13:
            delegations = _context.sent.delegation_responses;
            console.log('delegations: ', delegations);

            if (delegations) {
              _context.next = 17;
              break;
            }

            return _context.abrupt("continue", 46);

          case 17:
            _iterator2 = _createForOfIteratorHelper(delegations);
            _context.prev = 18;

            _iterator2.s();

          case 20:
            if ((_step2 = _iterator2.n()).done) {
              _context.next = 38;
              break;
            }

            delegationObj = _step2.value;
            delegation = delegationObj.delegation; // if (delegation.validator_address === "oraivaloper14vcw5qk0tdvknpa38wz46js5g7vrvut8ku5kaa" || delegation.validator_address === "oraivaloper1rqq57xt5r5pnuguffcrltnvkul7n0jdxxdgey0" || delegation.validator_address === "oraivaloper1mxqeldsxg60t2y6gngpdm5jf3k96dnju5el96f") {
            //     continue;
            // }

            msgDelegate = new message.cosmos.staking.v1beta1.MsgUndelegate({
              delegator_address: delegator,
              validator_address: delegation.validator_address,
              amount: {
                denom: cosmos.bech32MainPrefix,
                amount: delegationObj.balance.amount
              }
            });
            msgDelegateAny = new message.google.protobuf.Any({
              type_url: '/cosmos.staking.v1beta1.MsgUndelegate',
              value: message.cosmos.staking.v1beta1.MsgUndelegate.encode(msgDelegate).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgDelegateAny],
              memo: ''
            });
            _context.prev = 26;
            _context.next = 29;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 29:
            response = _context.sent;
            console.log(response);
            _context.next = 36;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](26);
            console.log(_context.t0);

          case 36:
            _context.next = 20;
            break;

          case 38:
            _context.next = 43;
            break;

          case 40:
            _context.prev = 40;
            _context.t1 = _context["catch"](18);

            _iterator2.e(_context.t1);

          case 43:
            _context.prev = 43;

            _iterator2.f();

            return _context.finish(43);

          case 46:
            _context.next = 6;
            break;

          case 48:
            _context.next = 53;
            break;

          case 50:
            _context.prev = 50;
            _context.t2 = _context["catch"](4);

            _iterator.e(_context.t2);

          case 53:
            _context.prev = 53;

            _iterator.f();

            return _context.finish(53);

          case 56:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 50, 53, 56], [18, 40, 43, 46], [26, 33]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli staking delegate --address oraivaloper1x6xl5kls4xkmkv3rst5tndmxtqt0u8dx7e4hn0 --amount 1 --chain-id private-Oraichain


exports["default"] = _default;