const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Product API',
      version: '1.0.0',
      description: 'API for managing products',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },
  apis: [ './api/components/Auth/auth.doc.js',
          './api/components/Product/product.doc.js',
 ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
