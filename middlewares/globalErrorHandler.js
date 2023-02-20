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

    
}

module.exports = errorHandler;