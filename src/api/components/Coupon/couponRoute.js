const express = require('express');
const router = express.Router();

const { createCoupon,
        getAllCoupons,
        updateCoupons, 
        deleteCoupon
} = require('./couponController');

const { authenticateUser, isAdmin } = require('../../middlewares/authenticate');

router.route('/').
    post(authenticateUser, isAdmin, createCoupon).
    get(authenticateUser, isAdmin, getAllCoupons);

router.route('/:id').
    put(authenticateUser, isAdmin, updateCoupons).
    delete(authenticateUser, isAdmin, deleteCoupon)


module.exports = router