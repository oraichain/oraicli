"use strict";

var crypto = require('crypto');

var encrypt = function encrypt(password, val) {
  var hash = crypto.createHash('sha256').update(password).digest('hex');
  var ENC_KEY = hash.substr(0, 32);
  var IV = hash.substr(32, 16);
  var cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  var encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher["final"]('base64');
  return encrypted;
};

var decrypt = function decrypt(password, encrypted) {
  var hash = crypto.createHash('sha256').update(password).digest('hex');
  var ENC_KEY = hash.substr(0, 32);
  var IV = hash.substr(32, 16);
  var decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  var decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return decrypted + decipher["final"]('utf8');
};

module.exports = {
  decrypt: decrypt,
  encrypt: encrypt
};