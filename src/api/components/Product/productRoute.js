const express = require('express');
const router = express.Router();

const { createProduct,
        getSingleProduct,
        getAllProducts,
        updateProduct,
        deleteProduct,
        wishlist,
        rating,
} = require('./productController');

const uploader = require('../../services/upload/cloudinary');

const { isAdmin, 
        authMiddleware } = require('../../Middlewares/authMiddleware');

router.route('/').
    post(authMiddleware, isAdmin, uploader.single('images'), createProduct).
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
