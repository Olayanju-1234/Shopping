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
        url: 'http://localhost:5000/api/v1' || 'https://shopping-ljzk.onrender.com/api/v1',
      },
    ],
  },
  apis: [
    '@auth/auth.doc.js',
    '@user/user.doc.js',
    '@product/product.doc.js',
    '@blog/blog.doc.js',
    '@brand/brand.doc.js',
    '@cart/cart.doc.js',
    '@order/order.doc.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
