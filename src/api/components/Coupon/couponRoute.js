const router = require('express').Router();
const { createCoupon,
        getAllCoupons,
        updateCoupons, 
        deleteCoupon} = require('../controllers/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.route('/').
    post(authMiddleware, isAdmin, createCoupon).
    get(authMiddleware, isAdmin, getAllCoupons);

router.route('/:id').
    put(authMiddleware, isAdmin, updateCoupons).
    delete(authMiddleware, isAdmin, deleteCoupon)


module.exports = router