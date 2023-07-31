const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message);
        this.statusCodes = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthorizedError;
