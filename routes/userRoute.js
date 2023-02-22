const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser
} = require('../controllers/userController');

router.route('/').get(getAllUsers);

router.route('/:id')
    .get(getUserById)
    .patch(updateProfile)
    .delete(deleteUser)
;


module.exports = router
