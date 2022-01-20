"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _fs = _interopRequireDefault(require("fs"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var message = _cosmosjs["default"].message;
var addressSymbols = [{
  url: 'https://gist.githubusercontent.com/ducphamle2/ee1162517b5abf161980d1ffa77838d8/raw/794ba0100af0dff5df1d5d12ee0c4ab109716070/binance.js',
  address: 'orai1mhz3flskea749v0mnejkfptt75fsru9a94082d'
}, {
  url: 'https://gist.githubusercontent.com/ducphamle2/8e637099977aa66abd4d63be9ae59264/raw/7fb307513c745eddfb402a4ff5fdaf1d7c7fb58e/coinbase.js',
  address: 'orai1e8p3pteuvc7evux3ycdlhx4hfqu5lmu98967sj'
}, {
  url: 'https://gist.githubusercontent.com/ducphamle2/81c9887d268dc1dea16c5b72ce74f108/raw/bb974883d44623d55983597382bfb8ffaacddce6/gate.js',
  address: 'orai1yf9kcjamkktpgraj7lw9cruv2v9wv08wlkz9jr'
}, {
  url: 'https://gist.githubusercontent.com/ducphamle2/8ee1d1ffbf52463e48ca9949283ed1db/raw/637ffa6bb92ff262940b5ada9d08a987543bfda2/kucoin.js',
  address: 'orai13uuw849mekkguatd70z4wc8hucwvcw88v3r8s2'
}];
var addressIds = [{
  url: 'https://gist.githubusercontent.com/ducphamle2/d23e4dc7e0967205298efffe8096c2d7/raw/fbbb8461e010ab54ba1ce30b2b2d41f18574e546/coincap.js',
  address: 'orai1664806rc8qt7wyjau4d4e34vwnxyj2rk94l0ef'
}, {
  url: 'https://gist.githubusercontent.com/ducphamle2/3b99613f1fb6e51c38187820168844f2/raw/fe38a5c898a7a9e5ee92fd0e6acf09f7c9988fae/coingecko.js',
  address: 'orai1mmeeucc3kl94e2wz98txe4y4wu22reenwwqu5z'
}];
var symbols = ['BTC', 'ETH', 'BNB', 'XRP', 'DOGE', 'USDT', 'LINK', 'UNI', 'USDC', 'BUSD', 'ORAI', 'DAI', 'SOL', 'MATIC', 'SUSHI', 'DOT', 'LUNA', 'ICP', 'XLM', 'ATOM', 'AAVE', 'THETA', 'EOS', 'CAKE', 'AXS', 'ALGO', 'MKR', 'KSM', 'XTZ', 'FIL', 'AMP ', 'RUNE', 'COMP', 'OHM', 'TIME', 'MIM', 'SPELL', 'ICE', 'GALA', 'MANA', 'ENJ', 'SAND'];
var ids = ['bitcoin', 'ethereum', 'binance-coin', 'ripple', 'dogecoin', 'tether', 'chainlink', 'uniswap', 'usd-coin', 'binance-usd', 'oraichain-token', 'multi-collateral-dai', 'solana', 'polygon', 'sushiswap', 'polkadot', 'terra-luna', 'internet-computer-price', 'stellar', 'cosmos', 'aave', 'theta', 'eos', 'pancakeswap', 'axie-infinity', 'algorand', 'maker', 'kusama', 'tezos', 'filecoin', 'amp', 'thorchain', 'compound', 'olympus', 'wonderland', 'magic-internet-money', 'spell-token', 'ice-token', 'gala', 'decentraland', 'enjincoin', 'the-sandbox'];

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
  return msgSendAny;
};

var getTxBody = function getTxBody(msgs) {
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: msgs
  });
};

var getPriceFeedMsg = function getPriceFeedMsg(url, params, contractAddr, sender) {
  var payload = Buffer.from(JSON.stringify({
    set_state: {
      state: {
        script_url: url,
        parameters: [JSON.stringify(params)],
        language: 'node'
      }
    }
  }));
  return getHandleMessage(contractAddr, payload, sender, 0);
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var argv, mnemonic, fees, gas, childKey, sender, msgs, _iterator, _step, addrSymbol, _iterator2, _step2, addrId, txBody, res;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            argv = yargs.argv;
            mnemonic = argv.mnemonic, fees = argv.fees, gas = argv.gas;
            childKey = cosmos.getChildKey(mnemonic);
            sender = cosmos.getAddress(childKey);
            _context.prev = 4;
            msgs = [];
            _iterator = _createForOfIteratorHelper(addressSymbols);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                addrSymbol = _step.value;
                // update markethub implementation
                msgs.push(getPriceFeedMsg(addrSymbol.url, symbols, addrSymbol.address, sender));
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            _iterator2 = _createForOfIteratorHelper(addressIds);

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                addrId = _step2.value;
                msgs.push(getPriceFeedMsg(addrId.url, ids, addrId.address, sender));
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            txBody = getTxBody(msgs);
            _context.next = 13;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 13:
            res = _context.sent;
            console.log(res);
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](4);
            console.log('error: ', _context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 17]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;