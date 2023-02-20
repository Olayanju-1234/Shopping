class AppError extends Error {
    constructor(errorCode, message, statusCodes) {
        super(message);
        this.errorCode = errorCode;
        this.statusCodes = statusCodes;
    }
}

module.exports = AppError;