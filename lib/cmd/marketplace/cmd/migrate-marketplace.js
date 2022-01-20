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

var _fs = _interopRequireDefault(require("fs"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var message = _cosmosjs["default"].message;

var getStoreMessage = function getStoreMessage(wasm_byte_code, sender, source) {
  var msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
    wasm_byte_code: wasm_byte_code,
    sender: sender,
    source: source ? source : ''
  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgStoreCode',
    value: message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish()
  });
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

var getInstantiateMessage = function getInstantiateMessage(code_id, init_msg, sender) {
  var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var amount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var sent_funds = amount ? [{
    denom: cosmos.bech32MainPrefix,
    amount: amount
  }] : null;
  var msgSend = new message.cosmwasm.wasm.v1beta1.MsgInstantiateContract({
    code_id: code_id,
    init_msg: init_msg,
    label: label,
    sender: sender,
    sent_funds: sent_funds
  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmwasm.wasm.v1beta1.MsgInstantiateContract',
    value: message.cosmwasm.wasm.v1beta1.MsgInstantiateContract.encode(msgSend).finish()
  });
  return new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny]
  });
};

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

var getSendMessage = function getSendMessage(from_address, to_address, coin) {
  var msgSend = new message.cosmos.bank.v1beta1.MsgSend({
    from_address: from_address,
    to_address: to_address,
    amount: [coin] // 10

  });
  var msgSendAny = new message.google.protobuf.Any({
    type_url: '/cosmos.bank.v1beta1.MsgSend',
    value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
  });
  var txBody = new message.cosmos.tx.v1beta1.TxBody({
    messages: [msgSendAny],
    memo: ''
  });
  return txBody;
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$opt, argv, _argv$_$slice, _argv$_$slice2, file, gas, source, mnemonic, fees, label, input, amount, markethub, nftcontract, minter_mnemonic, oldmarket, childKey, minterChildKey, sender, minterSender, wasmBody, txBody, res, codeId, payload, address, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$opt = yargs.positional('file', {
              describe: 'the smart contract file',
              type: 'string'
            }).option('label', {
              describe: 'the label of smart contract',
              type: 'string'
            }).option('source', {
              describe: 'the source code of the smart contract',
              type: 'string'
            }).option('fees', {
              describe: 'the transaction fees',
              type: 'string'
            }).option('amount', {
              type: 'string'
            }).option('markethub', {
              type: 'string'
            }).option('nftcontract', {
              type: 'string'
            }).option('oldmarket', {
              type: 'string'
            }), argv = _yargs$positional$opt.argv;
            _argv$_$slice = argv._.slice(-1), _argv$_$slice2 = (0, _slicedToArray2["default"])(_argv$_$slice, 1), file = _argv$_$slice2[0];
            gas = argv.gas, source = argv.source, mnemonic = argv.mnemonic, fees = argv.fees, label = argv.label, input = argv.input, amount = argv.amount, markethub = argv.markethub, nftcontract = argv.nftcontract, minter_mnemonic = argv.minter_mnemonic, oldmarket = argv.oldmarket;
            childKey = cosmos.getChildKey(mnemonic);
            minterChildKey = cosmos.getChildKey(minter_mnemonic);
            sender = cosmos.getAddress(childKey);
            minterSender = cosmos.getAddress(minterChildKey);
            wasmBody = _fs["default"].readFileSync(file).toString('base64');
            txBody = getStoreMessage(wasmBody, sender, source);
            _context.prev = 9;
            _context.next = 12;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 12:
            res = _context.sent;

            // console.log('res: ', res);
            if (res.tx_response.code !== 0) {
              console.log('response: ', res);
            }

            console.log('res: ', res); // next instantiate code

            codeId = res.tx_response.logs[0].events[0].attributes.find(function (attr) {
              return attr.key === 'code_id';
            }).value;
            payload = Buffer.from(input).toString('base64');
            txBody = getInstantiateMessage(codeId, payload, sender, label);
            _context.next = 20;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 20:
            res = _context.sent;
            console.log(res);
            address = JSON.parse(res.tx_response.raw_log)[0].events[1].attributes[0].value; // update markethub implementation

            payload = Buffer.from(JSON.stringify({
              update_implementation: {
                implementation: address
              }
            }));
            txBody = getHandleMessage(markethub, payload, sender, amount);
            _context.next = 27;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 27:
            res = _context.sent;
            console.log(res); // query balance of the marketplace

            _context.next = 31;
            return cosmos.get("/cosmos/bank/v1beta1/balances/".concat(oldmarket));

          case 31:
            data = _context.sent;

            if (!(data.balances.length > 0)) {
              _context.next = 44;
              break;
            }

            // withdraw funds to the new marketplace
            payload = Buffer.from(JSON.stringify({
              withdraw_funds: {
                funds: data.balances[0]
              }
            }));
            txBody = getHandleMessage(oldmarket, payload, sender, amount);
            _context.next = 37;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 37:
            res = _context.sent;
            console.log(res); // transfer funds to the new marketplace

            txBody = getSendMessage(sender, address, data.balances[0]);
            _context.next = 42;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 42:
            res = _context.sent;
            console.log(res);

          case 44:
            // change minter
            payload = Buffer.from(JSON.stringify({
              change_minter: address
            }));
            txBody = getHandleMessage(nftcontract, payload, minterSender, amount);
            _context.next = 48;
            return cosmos.submit(minterChildKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 48:
            res = _context.sent;
            console.log(res); // approve the new marketplace

            payload = Buffer.from(JSON.stringify({
              approve_all: {
                operator: address
              }
            }));
            txBody = getHandleMessage(nftcontract, payload, minterSender, amount);
            _context.next = 54;
            return cosmos.submit(minterChildKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(fees) ? 0 : parseInt(fees), gas);

          case 54:
            res = _context.sent;
            console.log(res);
            console.log('contract address: ', address);
            _context.next = 62;
            break;

          case 59:
            _context.prev = 59;
            _context.t0 = _context["catch"](9);
            console.log('error: ', _context.t0);

          case 62:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 59]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;