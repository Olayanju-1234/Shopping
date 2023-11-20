// Register module aliases and load environment variables
require('module-alias/register');
require('dotenv').config();

// Enable handling of asynchronous errors in Express
require('express-async-errors');

// Import necessary modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('@utils/logger');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger'); // Path to your Swagger configuration file

// Create an Express application
const app = express();

// Serve Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Import routes and configure database connection
const apiRoutes = require('@components/');
const connectDB = require('@config/connectDB');
const errorHandler = require('@middlewares/errorHandler');

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan('dev'));
app.use('/api/v1', apiRoutes);

// Default route for the root URL
app.use('/', (req, res) => {
  res.send('Welcome to the API');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Error handling middleware
app.use(errorHandler);

// Set the port to either the environment variable or a default value (5000)
const port = process.env.PORT || 5000;

// Start the server
const start = async () => {
  try {
    // Connect to the database
    connectDB();

    // Listen on the specified port
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    // Log any errors that occur during startup
    logger.error(error);
  }
};

// Call the start function to initiate the server
start();
