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

const {authenticateUser,
        isAdmin
} = require('../../middlewares/authenticate');


router.route('/').get(getAllUsers);
router.put("/edit", authenticateUser, updateProfile)
router.put("/address", authenticateUser, saveAddress)

router.put('/order-status/:orderId', authenticateUser, isAdmin, updateOrderStatus)

router.route('/cart').
    post(authenticateUser, userCart).
    get(authenticateUser, getUserCart).
    delete(authenticateUser, emptyUserCart)

router.put('/block/:id', authenticateUser, isAdmin, blockUser)
router.put('/unblock/:id', authenticateUser, isAdmin, unblockUser)
router.get('/wishlist', authenticateUser, getWishlist)
router.post('/cart/use-coupon', authenticateUser, useCoupon)
router.post('/cart/create-order', authenticateUser, createOrder)
router.get('/orders', authenticateUser, getOrders)

router.route('/:id')
    .get(authenticateUser, isAdmin, getUserById)
    .delete(deleteUser)
;


module.exports = router
