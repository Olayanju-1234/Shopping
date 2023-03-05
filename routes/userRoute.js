const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    blockUser,
    unblockUser,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart
} = require('../controllers/userController');

const {authMiddleware,
isAdmin} = require('../middlewares/authMiddleware');


router.route('/').get(getAllUsers);
router.put("/edit", authMiddleware, updateProfile)
router.put("/address", authMiddleware, saveAddress)
router.route('/cart').
    post(authMiddleware, userCart).
    get(authMiddleware, getUserCart)
router.put('/block/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser)
router.get('/wishlist', authMiddleware, getWishlist)



router.route('/:id')
    .get(authMiddleware, isAdmin, getUserById)
    .delete(deleteUser)
;


module.exports = router
