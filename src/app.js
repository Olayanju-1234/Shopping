require('module-alias/register');
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('@utils/logger');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger'); // Path to your Swagger configuration file

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const apiRoutes = require('@components/');
const connectDB = require('@config/connectDB');
const errorHandler = require('@middlewares/errorHandler');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan('dev'));
app.use('/api/v1', apiRoutes);

app.use('/', (req, res) => {
  res.send('Welcome to the API');
});

// health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    connectDB();
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

start();
