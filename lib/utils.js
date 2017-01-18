var crypto = require('crypto');

function genToken() {
  return crypto.randomBytes(20).toString('hex');
}

module.exports.genToken = genToken;
