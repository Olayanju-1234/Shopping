const express = require('express');
const router = express.Router();

const { createCoupon,
        getAllCoupons,
        updateCoupons, 
        deleteCoupon
} = require('./couponController');

const { authMiddleware, isAdmin } = require('../../Middlewares/authMiddleware');

router.route('/').
    post(authMiddleware, isAdmin, createCoupon).
    get(authMiddleware, isAdmin, getAllCoupons);

router.route('/:id').
    put(authMiddleware, isAdmin, updateCoupons).
    delete(authMiddleware, isAdmin, deleteCoupon)


module.exports = router