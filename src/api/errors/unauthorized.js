const { StatusCodes } = require('http-status-codes');
const AppError = require('./CustomError');

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
