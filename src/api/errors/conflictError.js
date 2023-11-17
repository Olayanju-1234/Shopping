const { StatusCodes } = require('http-status-codes');
const AppError = require('./CustomError');

class ConflictError extends AppError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.CONFLICT;
  }
}

module.exports = ConflictError;
