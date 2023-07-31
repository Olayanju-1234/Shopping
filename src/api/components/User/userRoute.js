const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    blockUser,
    unblockUser,
    getWishlist,
    saveAddress,
    useCoupon,
} = require('./userController');

const {
    userCart,
    getUserCart,
    emptyUserCart,
} = require('../Cart/cartController')

const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require('../Order/orderController')

const {authMiddleware,
        isAdmin
} = require('../../Middlewares/authMiddleware');


router.route('/').get(getAllUsers);
router.put("/edit", authMiddleware, updateProfile)
router.put("/address", authMiddleware, saveAddress)

router.put('/order-status/:orderId', authMiddleware, isAdmin, updateOrderStatus)

router.route('/cart').
    post(authMiddleware, userCart).
    get(authMiddleware, getUserCart).
    delete(authMiddleware, emptyUserCart)

router.put('/block/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser)
router.get('/wishlist', authMiddleware, getWishlist)
router.post('/cart/use-coupon', authMiddleware, useCoupon)
router.post('/cart/create-order', authMiddleware, createOrder)
router.get('/orders', authMiddleware, getOrders)

router.route('/:id')
    .get(authMiddleware, isAdmin, getUserById)
    .delete(deleteUser)
;


module.exports = router
