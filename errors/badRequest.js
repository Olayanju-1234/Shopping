const { StatusCodes } = require('http-status-codes')
const AppError = require('./AppError')

class BadRequestError extends AppError {
    constructor(message) {
        super(message)
        this.message = "Bad request error"
        this.statusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError