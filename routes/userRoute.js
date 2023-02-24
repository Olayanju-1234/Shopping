const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser
} = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');

router.route('/').get(getAllUsers);

router.route('/:id')
    .get(authMiddleware, getUserById)
    .patch(updateProfile)
    .delete(deleteUser)
;


module.exports = router
