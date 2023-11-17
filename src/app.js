require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger'); // Path to your Swagger configuration file

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const apiRoutes = require('./api/components/index');
const connectDB = require('./Config/connectDB');
const errorHandler = require('./api/middlewares/errorHandler');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan('dev'));
app.use('/api/v1', apiRoutes);

app.use('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
};

start();
