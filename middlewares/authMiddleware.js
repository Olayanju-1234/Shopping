const {generateAccessToken, verifyAccessToken} = require('../config/jsonwebtoken')
const AppError = require('../errors/errors')


const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) throw new AppError.UnauthorizedError('Please, add your access token')
        const user = await verifyAccessToken({token})
        req.user = user
        console.log('user', user);
        next()
    } catch (error) {
        next(error)
    }

}

module.exports = authMiddleware
