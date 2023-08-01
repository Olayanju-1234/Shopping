const {generateAccessToken, verifyAccessToken} = require('../utils/tokens')
const jwt = require('jsonwebtoken')
const User = require('../components/User/UserModel')
const AppError = require('../errors/CustomError')


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

// create jwt token
// const authMiddleware = async (req, res, next) => {
//     const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
//         expiresIn: "1d",
//     });
//     req.token = token;
//     next();
// };

// // verify jwt token
// const verifyToken = async (req, res, next) => {
//     const token = jwt.verify(req.token, process.env.JWT_SECRET);
//     return token;
// };

// // attach cookie to response
// const attachToken = async (req, res, next) => {
//     res.cookie("token", req.token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//     });

//     next();
// };




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
