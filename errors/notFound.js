const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class NotFoundError extends AppError {
    constructor(message) {
        super(message);
        this.statusCodes = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;