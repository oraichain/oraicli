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

var _jsSha = _interopRequireDefault(require("js-sha256"));

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var _yargs$positional$pos, argv, base64, uintArr, message, msg, hash, decode_body, typeUrl, urlArr, msgType, i, value;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _yargs$positional$pos = yargs.positional('script', {
              describe: 'the script type',
              type: 'string'
            }).positional('name', {
              describe: 'the script name',
              type: 'string'
            }), argv = _yargs$positional$pos.argv;
            base64 = 'Cp8BCpwBCjcvY29zbW9zLmRpc3RyaWJ1dGlvbi52MWJldGExLk1zZ1dpdGhkcmF3RGVsZWdhdG9yUmV3YXJkEmEKK29yYWkxMzBqc2w2NnJnc3M2ZXE3cXVyMDJ5ZnI2dHpwcGR2eGdrZzk2NDASMm9yYWl2YWxvcGVyMTMwanNsNjZyZ3NzNmVxN3F1cjAyeWZyNnR6cHBkdnhnbHo3bjdnEloKUgpGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQKJzoUdo6kFlyUrTtOQgNA6/NY+ulQeJGDc6eB42FbDmBIECgIIARie/wISBBDAmgwaQJLdDlaMg92tI0y1HSCsQWIw3Fr+SWtzVri1RU9ZTgGUTVQfWigHuh1kCVzqhXTsGMnXZ7DEEhnram73Upu0tT4=';
            uintArr = Buffer.from(base64, 'base64');
            message = _cosmosjs["default"].message;
            msg = message.cosmos.tx.v1beta1.TxRaw.decode(uintArr);
            hash = _jsSha["default"].sha256(uintArr);
            console.log('msg: ', hash); //console.log("message: ", msg)

            decode_body = message.cosmos.tx.v1beta1.TxBody.decode(msg.body_bytes); //console.log("decode body: ", decode_body)

            typeUrl = decode_body.messages[0].type_url.substring(1);
            urlArr = typeUrl.split('.');
            msgType = message;

            for (i = 0; i < urlArr.length; i++) {
              msgType = msgType[urlArr[i]];
            }

            value = msgType.decode(decode_body.messages[0].value);
            console.log('value decoded: ', value);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // yarn oraicli provider get-script datasource nl008


exports["default"] = _default;