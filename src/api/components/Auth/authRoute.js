const express = require('express');
const router = express.Router();

const {
    register,
    login,
    adminLogin,
    logout,
    handleRefreshToken,
    updatePassword,
    resetPasswordToken,
    resetPassword
} = require('./authController')

const { authenticateUser } = require('../../middlewares/authenticate')

router.post("/", register)
router.post("/login", login)
router.post("/login/admin", adminLogin)
router.post("/logout", logout)
router.get("/refresh", handleRefreshToken)
router.put("/password", authenticateUser, updatePassword)
router.post("/reset-password-token", resetPasswordToken)
router.put("/resetpassword/:token", resetPassword)

module.exports = router;