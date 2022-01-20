"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = require("yargs");

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(yargs) {
    var base64regex, list, mappedList, finalList, popTemp, finalListUnique;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
            _context.next = 3;
            return fetch("https://api.scan.orai.io/v1/txs-account/orai17n62uccsxaryx3lnwdk4pxxvh09rsdm570zavk?limit=100&page_id=1").then(function (data) {
              return data.json();
            });

          case 3:
            list = _context.sent;
            mappedList = list.data.map(function (tx) {
              return {
                address: tx.messages[0].from_address,
                pubkey: tx.memo
              };
            });
            finalList = mappedList.filter(function (element) {
              return base64regex.test(element.pubkey);
            });
            popTemp = finalList.pop();
            finalListUnique = (0, _toConsumableArray2["default"])(new Set(finalList));
            console.log("final list: ", JSON.stringify(finalListUnique));
            console.log("length: ", finalListUnique.length);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;