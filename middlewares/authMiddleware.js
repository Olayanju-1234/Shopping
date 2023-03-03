const {generateAccessToken, verifyAccessToken} = require('../config/jsonwebtoken')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const AppError = require('../errors/errors')


const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) throw new AppError.UnauthorizedError('Please, add your access token')
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.id)
        req.user = user
        next()
    } catch (error) {
        next(error)
    }

}

const isAdmin = async (req, res, next) => {
    const { username } = req.user
    const adminRole = await User.findOne({ username });
    if (adminRole.role !== "admin") {
        throw new AppError.UnauthorizedError("You are not an admin")
    } else {
        next();
    }
}


module.exports = {authMiddleware,
isAdmin}
