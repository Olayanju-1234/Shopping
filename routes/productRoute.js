const router = require('express').Router();

const { createProduct,
        getSingleProduct,
        getAllProducts,
        updateProduct,
        deleteProduct,
        wishlist,
        rating,
        uploadImages } = require('../controllers/productController');

const { uploadImage, 
        resizeProductImage } = require('../middlewares/uploadImage');

const { isAdmin, 
        authMiddleware } = require('../middlewares/authMiddleware');

router.route('/').
    post(authMiddleware, isAdmin,createProduct).
    get(getAllProducts);

router.route('/upload/images/:id').
    put(authMiddleware, isAdmin, 
        uploadImage.array("images", 10), resizeProductImage, 
        uploadImages);

router.route('/wishlist').
    put(authMiddleware, wishlist); 

router.route('/rating').
    put(authMiddleware, rating);


router.route('/:id').
    get(getSingleProduct).
    put(authMiddleware, isAdmin, updateProduct).
    delete(authMiddleware, isAdmin,deleteProduct);

module.exports = router
