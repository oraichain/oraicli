"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _bech = _interopRequireDefault(require("bech32"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional, argv, message, childKey, createProposal, createProposalMsgAny, msgGov, msgGovAny, txBody, res;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional = yargs.positional('oldName', {
              describe: 'the old oscript name',
              type: 'string'
            }), argv = _yargs$positional.argv;
            message = _cosmosjs["default"].message;
            childKey = cosmos.getChildKey(argv.mnemonic);
            createProposal = new message.cosmos.params.v1beta1.ParameterChangeProposal({
              title: 'hello world',
              description: 'foo bar',
              changes: [{
                subspace: 'staking',
                key: 'UnbondingTime',
                value: JSON.stringify('36000')
              }]
            });
            createProposalMsgAny = new message.google.protobuf.Any({
              type_url: '/cosmos.params.v1beta1.ParameterChangeProposal',
              value: message.cosmos.params.v1beta1.ParameterChangeProposal.encode(createProposal).finish()
            });
            msgGov = new message.cosmos.gov.v1beta1.MsgSubmitProposal({
              content: createProposalMsgAny,
              proposer: cosmos.getAddress(childKey),
              initial_deposit: [{
                denom: cosmos.bech32MainPrefix,
                amount: '10'
              }]
            });
            msgGovAny = new message.google.protobuf.Any({
              type_url: '/cosmos.gov.v1beta1.MsgSubmitProposal',
              value: message.cosmos.gov.v1beta1.MsgSubmitProposal.encode(msgGov).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgGovAny]
            });
            _context.prev = 8;
            _context.next = 11;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 11:
            res = _context.sent;
            console.log(res);
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](8);
            console.log('error: ', _context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 15]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // example: yarn oraicli proposals create-proposal


exports["default"] = _default;