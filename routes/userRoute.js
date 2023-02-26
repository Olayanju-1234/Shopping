const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    blockUser,
    unblockUser
} = require('../controllers/userController');

const {authMiddleware,
isAdmin} = require('../middlewares/authMiddleware');

router.route('/').get(getAllUsers);
router.put("/edit", authMiddleware, updateProfile)
router.put('/block/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser)


router.route('/:id')
    .get(authMiddleware, isAdmin, getUserById)
    .delete(deleteUser)
;


module.exports = router
