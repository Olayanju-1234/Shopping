const router = require('express').Router();
const {
    register,
    login,
    logout,
    handleRefreshToken,
    updatePassword
} = require('../controllers/authController')

const { authMiddleware } = require('../middlewares/authMiddleware')

router.post("/", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/refresh", handleRefreshToken)
router.put("/password", authMiddleware, updatePassword)

module.exports = router;