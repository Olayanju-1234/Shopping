const express = require('express');
const router = express.Router();

const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  wishlist,
  rateProduct,
} = require('./product.controller');

const uploader = require('../../services/upload/cloudinary');

const { isAdmin, authenticateUser } = require('../../middlewares/authenticate');

router.route('/').post(authenticateUser, isAdmin, uploader.single('images'), createProduct).get(getAllProducts);

router.route('/wishlist').put(authenticateUser, wishlist);

router.route('/rating').put(authenticateUser, rateProduct);

router
  .route('/:id')
  .get(getSingleProduct)
  .put(authenticateUser, isAdmin, updateProduct)
  .delete(authenticateUser, isAdmin, deleteProduct);

module.exports = router;
