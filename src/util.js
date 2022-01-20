const crypto = require('crypto');

const encrypt = (password, val) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const ENC_KEY = hash.substr(0, 32);
  const IV = hash.substr(32, 16);
  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

const decrypt = (password, encrypted) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const ENC_KEY = hash.substr(0, 32);
  const IV = hash.substr(32, 16);
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};

module.exports = { decrypt, encrypt };
