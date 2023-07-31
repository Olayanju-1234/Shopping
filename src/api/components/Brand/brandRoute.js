const express = require('express');
const router = express.Router();

const { createBrand,
        updateBrand,
        getSingleBrand,
        getAllBrands,   
        deleteBrand 
} = require('./brandController')

const { authMiddleware, isAdmin } = require('../../Middlewares/authMiddleware')

router.route('/').
    post(authMiddleware, isAdmin, createBrand).
    get(getAllBrands)

router.route('/:id').
    put(authMiddleware, isAdmin, updateBrand).
    get(authMiddleware, getSingleBrand).
    delete(authMiddleware, isAdmin, deleteBrand)


module.exports = router