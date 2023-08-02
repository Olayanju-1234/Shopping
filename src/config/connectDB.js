
const logger = require('../api/utils/logger')

const connection = {
    HOST: "localhost",
    PORT: 27017,
    DB: "Shopping"
}

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const connectDB = () =>{
    try {
        mongoose.connect(`mongodb://${connection.HOST}:${connection.PORT}/${connection.DB}`, {
        
        });
        logger.info("Connected to MongoDB successfully")
    } catch (error) {
        logger.error(error);
    }
}


module.exports = connectDB;