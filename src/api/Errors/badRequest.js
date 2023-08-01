const { StatusCodes } = require('http-status-codes')
const AppError = require('./CustomError')

class BadRequestError extends AppError {
    constructor(message) {
        super(message)
        this.statusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError