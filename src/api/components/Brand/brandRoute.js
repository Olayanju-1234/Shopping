const express = require('express');
const router = express.Router();

const { createBrand,
        updateBrand,
        getSingleBrand,
        getAllBrands,   
        deleteBrand 
} = require('./brandController')

const { authenticateUser, isAdmin } = require('../../middlewares/authMiddleware')

router.route('/').
    post(authenticateUser, isAdmin, createBrand).
    get(getAllBrands)

router.route('/:id').
    put(authenticateUser, isAdmin, updateBrand).
    get(authenticateUser, getSingleBrand).
    delete(authenticateUser, isAdmin, deleteBrand)


module.exports = router