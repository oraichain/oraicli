"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _yargs = _interopRequireDefault(require("yargs/yargs"));

var _fs = _interopRequireDefault(require("fs"));

var _helpers = require("yargs/helpers");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cosmosjs = _interopRequireDefault(require("@oraichain/cosmosjs"));

var _readlineSync = _interopRequireDefault(require("readline-sync"));

var _util = require("./util");

var password;

var decryptMnemonic = function decryptMnemonic(mnemonic) {
  if (mnemonic && mnemonic.indexOf(' ') === -1) {
    if (!password) {
      password = _readlineSync["default"].question('enter passphrase:', {
        hideEchoBack: true
      });
    }

    return (0, _util.decrypt)(password, mnemonic);
  }

  return mnemonic;
};

var argv = (0, _yargs["default"])((0, _helpers.hideBin)(process.argv)).config('env', function (path) {
  var config = _dotenv["default"].config({
    path: path
  }).parsed; // global


  global.cosmos = new _cosmosjs["default"](config.URL || 'https://lcd.orai.io', config.CHAIN_ID || 'Oraichain');
  cosmos.setBech32MainPrefix(config.DENOM || 'orai');
  return {
    mnemonic: decryptMnemonic(config.MNEMONIC || config.SEND_MNEMONIC),
    minter_mnemonic: decryptMnemonic(config.MINTER_MNEMONIC)
  };
}).config('file-input', function (path) {
  return {
    input: _fs["default"].readFileSync(path).toString()
  };
})["default"]('env', '.env').alias('help', 'h').alias('version', 'v').command('send [address]', 'send token', require('./cmd/send/index')["default"]).command('send-cosmjs [address]', 'send token using cosmjs library', require('./cmd/send/send-cosmjs')["default"]).command('drand', 'drand utility', require('./cmd/drand/index')["default"]).command('send-to-one [address]', 'send tokens to one address', require('./cmd/send/send-to-one')["default"]).command('multisend [address]', 'send token', require('./cmd/send/multisend')["default"]).command('account', 'account commands', require('./cmd/account')["default"]).command('staking', 'staking commands', require('./cmd/staking')["default"]).command('wasm', 'wasm commands', require('./cmd/wasm')["default"]).command('marketplace', 'marketplace commands', require('./cmd/marketplace')["default"]).command('provider', 'update provider data', require('./cmd/provider')["default"]).command('airequest', 'airequest commands', require('./cmd/airequest')["default"]).command('distr', 'distribution commands', require('./cmd/distr')["default"]).command('ibc', 'ibc commands', require('./cmd/ibc')["default"]).command('airi', 'airi commands', require('./cmd/airi')["default"]).command('proposals', 'prososal commands', require('./cmd/proposal')["default"]).command('pricefeed', 'pricefeed commands', require('./cmd/pricefeed')["default"]).option('memo', {
  "default": '',
  type: 'string'
}).option('gas', {
  type: 'number',
  "default": 2000000
}).argv;