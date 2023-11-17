const logger = require('../api/utils/logger');
const config = require('config');

const connection = {
  HOST: config.get('DB_HOST'),
  PORT: config.get('DB_PORT'),
  DB_NAME: config.get('DB_NAME'),
};

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const connectDB = () => {
  try {
    mongoose.connect(`mongodb://${connection.HOST}:${connection.PORT}/${connection.DB_NAME}`, {});
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error(error);
  }
};

module.exports = connectDB;
