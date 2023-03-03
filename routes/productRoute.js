const router = require('express').Router();
const { createProduct,
        getSingleProduct,
        getAllProducts,
        updateProduct,
        deleteProduct,
        wishlist,
        rating } = require('../controllers/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.route('/').
    post(authMiddleware, isAdmin,createProduct).
    get(getAllProducts);

router.route('/wishlist').
    put(authMiddleware, wishlist); 

router.route('/rating').
    put(authMiddleware, rating);


router.route('/:id').
    get(getSingleProduct).
    put(authMiddleware, isAdmin, updateProduct).
    delete(authMiddleware, isAdmin,deleteProduct);

module.exports = router
