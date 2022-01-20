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

var _long = _interopRequireDefault(require("long"));

var message = _cosmosjs["default"].message;

var checkVoteOption = function checkVoteOption(option) {
  switch (option) {
    case 1:
      return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_YES;

    case 2:
      return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_ABSTAIN;

    case 3:
      return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_NO;

    case 4:
      return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_NO_WITH_VETO;

    default:
      return message.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_ABSTAIN;
  }
};

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$option$option, argv, mnemonic, amount, proposal_id, option, childKey, voter, msgVote, msgVoteAny, txBody, res;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$option$option = yargs.option('proposal_id', {
              describe: 'proposal id to deposit into',
              type: 'number'
            }).option('option', {
              describe: 'vote option',
              type: 'number'
            }), argv = _yargs$option$option.argv;
            mnemonic = argv.mnemonic, amount = argv.amount, proposal_id = argv.proposal_id, option = argv.option;
            childKey = cosmos.getChildKey(mnemonic);
            voter = cosmos.getAddress(childKey);
            msgVote = new message.cosmos.gov.v1beta1.MsgVote({
              proposal_id: new _long["default"](proposal_id),
              voter: voter,
              option: checkVoteOption(option)
            });
            msgVoteAny = new message.google.protobuf.Any({
              type_url: '/cosmos.gov.v1beta1.MsgVote',
              value: message.cosmos.gov.v1beta1.MsgVote.encode(msgVote).finish()
            });
            txBody = new message.cosmos.tx.v1beta1.TxBody({
              messages: [msgVoteAny]
            });
            _context.prev = 7;
            _context.next = 10;
            return cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));

          case 10:
            res = _context.sent;
            console.log(res);
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](7);
            console.log('error: ', _context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 14]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // example: yarn oraicli proposals vote --proposal_id 10 --option 1


exports["default"] = _default;