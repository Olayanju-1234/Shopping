const CustomError = require('./CustomError')
const BadRequestError = require('./badRequest')
const NotFoundError = require('./notFound')
const UnauthorizedError = require('./unauthorized')
const ForbiddenError = require('./forbidden')
const ConflictError = require('./conflictError')

module.exports = {
    CustomError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
}