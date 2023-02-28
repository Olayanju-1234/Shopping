const router = require('express').Router();
const { createProduct,
        getSingleProduct,
        getAllProducts,
        updateProduct } = require('../controllers/productController');

router.route('/').
    post(createProduct).
    get(getAllProducts);

router.route('/:id').
    get(getSingleProduct).
    put(updateProduct);

module.exports = router
