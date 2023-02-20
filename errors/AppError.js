class AppError extends Error {
    constructor(message, statusCodes) {
        super(message);
        this.message = message;
        this.statusCodes = statusCodes;
    }
}

module.exports = AppError;