const { generateToken, verifyToken, attachTokenToCookies } = require('./jwt');

module.exports = {
  generateToken,
  verifyToken,
  attachTokenToCookies,
};
