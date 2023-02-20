const router = require('express').Router();
const {
    register,
    login,
    logout
} = require('../controllers/authController')

router.post("/", register)
router.post("/login", login)
router.post("/logout", logout)

module.exports = router;