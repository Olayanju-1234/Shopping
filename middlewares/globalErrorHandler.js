const { StatusCodes } = require('http-status-codes');

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    if(err.name === "ValidationError") {
        return res.status(StatusCodes.BAD_REQUEST).send({
            type: "ValidationError",
            details: err.details
        })
    }

    // Duplicate error
    if(err.code === 11000) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            type: "DuplicateError",
            details: err.keyValue
        })
    }

    // Cast error
    if(err.name === "CastError") {
        return res.status(StatusCodes.BAD_REQUEST).send({
            type: "CastError",
            details: err.value
        })
    }

    // Default error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        type: "InternalServerError",
        details: err
    })
}

module.exports = errorHandler;