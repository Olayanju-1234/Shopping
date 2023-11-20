const { StatusCodes } = require('http-status-codes');

// Send a success response
const SuccessResponse = (res, data = null, message = 'Success') => {
  res.status(StatusCodes.OK).json({
    success: true,
    message,
    data,
  });
};

// Send an error response
const ErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
    },
  });
};

module.exports = {
  SuccessResponse,
  ErrorResponse,
};
