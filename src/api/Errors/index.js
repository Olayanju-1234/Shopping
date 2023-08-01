const AppError = require('./CustomError')
const BadRequestError = require('./badRequest')
const NotFoundError = require('./notFound')
const UnauthorizedError = require('./unauthorized')
const ForbiddenError = require('./forbidden')
const ConflictError = require('./conflictError')

module.exports = {
    AppError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
}