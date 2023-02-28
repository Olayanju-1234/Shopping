const router = require('express').Router();
const {
    register,
    login,
    logout,
    handleRefreshToken
} = require('../controllers/authController')

router.post("/", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/refresh", handleRefreshToken)

module.exports = router;