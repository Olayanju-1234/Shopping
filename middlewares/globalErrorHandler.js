const { StatusCodes } = require('http-status-codes');

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    // App error
    const appError = {
        statusCodes: err.statusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong",
    }

    // Validation error
    if(err.name === "ValidationError") {
       appError.message = Object.values(err.errors).map((val) => val.message)
       appError.statusCodes = StatusCodes.BAD_REQUEST
    }

    // Duplicate error
    if(err.code === 11000) {
       appError.message = "Duplicate field value entered"
        appError.statusCodes = StatusCodes.BAD_REQUEST

    }

    // Cast error
    if(err.name === "CastError") {
        appError.message = `Resource not found. Invalid: ${err.path}`
        appError.statusCodes = StatusCodes.NOT_FOUND
    }

    // Default error
    return res.status(appError.statusCodes).json({
        success: false,
        message: appError.message
    })
}

module.exports = errorHandler;