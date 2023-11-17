const { StatusCodes } = require('http-status-codes');
const AppError = require('./CustomError');

class ForbiddenError extends AppError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
