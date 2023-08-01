const mongoose = require('mongoose');
const AppError = require('../errors/CustomError');
const validateMongoId = (id) => {
    const isValid =  mongoose.Types.ObjectId.isValid(id);
    if(!isValid) {
        throw new AppError.BadRequestError("Invalid ID");
    }
};

module.exports = validateMongoId;
