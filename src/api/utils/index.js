const { generateToken, verifyToken, attachTokenToCookies } = require('./jwt');
const { SuccessResponse, ErrorResponse } = require('./responseHandler');

module.exports = {
  generateToken,
  verifyToken,
  attachTokenToCookies,
  SuccessResponse,
  ErrorResponse,
};
