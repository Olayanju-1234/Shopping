const User = require('../models/UserModel')
require('express-async-errors');
const { StatusCodes } = require('http-status-codes')
const {generateAccessToken} = require('../config/jsonwebtoken')
const AppError = require('../errors/errors')
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body
    // Validate fields
    if (!email || !username || !password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }
    // Check if a user exists already
    const emailExists = await User.findOne({email})
    if(emailExists) {
        throw new AppError.BadRequestError("Email taken")
    }
    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
    }

    const usernameExists = await User.findOne({username})
    if(usernameExists) {
        throw new AppError.BadRequestError("Username taken")
    }

    // Create new user
    const newUser = await User.create({
        firstName, lastName, email, username, password
    })

    res.status(StatusCodes.CREATED).json({
        success : true,
        user: newUser
    })

}

const login = async (req, res) => {
    const {username, password} = req.body
    // Validate fields
    if (!username || !password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }
    // Check if user exists
    const usernameExists = await User.findOne({username})
    if(!usernameExists) {
        throw new AppError.NotFoundError("User not found, Please register")
    }
    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
    }
    // Check if password is correct
    const passwordMatch = await usernameExists.matchedPassword(password)
    if(!passwordMatch) {
        throw new AppError.BadRequestError("Incorrect password")
    }
    const refreshToken = await generateRefreshToken(usernameExists._id)
    const updateUser = await User.findByIdAndUpdate(usernameExists._id, {refreshToken: refreshToken},
        {new:true});
    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        maxAge:72 * 60 * 60 * 1000
    }
    )
    res.status(StatusCodes.OK).json({
        success : true,
        user: usernameExists,
        token: generateAccessToken(usernameExists._id)
    })
}

// handleRefreshToken
const handleRefreshToken = async (req, res) => {
    const cookie = req.cookies
    if(!cookie.refreshToken) {
        throw new AppError.BadRequestError("No refresh token")
    }

    const refreshToken = cookie.refreshToken

    const user = await User.findOne({refreshToken});
    if(!user) {
        throw new AppError.BadRequestError("No user found/ Please login or register/ No refresh token")
    }   
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new AppError.BadRequestError("Invalid refresh token")
        }
        const accessToken = generateAccessToken(user.id)
        res.status(StatusCodes.OK).json({
            success : true,
            token: accessToken
    })
})}



const logout = async (req, res) => {
    const cookie = req.cookies

    if(!cookie.refreshToken) {
        throw new AppError.BadRequestError("No refresh token")
    }

    const refreshToken = cookie.refreshToken

    const user = await User.findOne({ refreshToken });

    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly:true,
            secure : true})
        throw new AppError.ForbiddenError("No user found/ Please login or register/ No refresh token")
    }

    await User.findOneAndUpdate({refreshToken}, {refreshToken: null})
    
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure : true})
    res.status(StatusCodes.OK).json({
        success : true,
        message: "Logged out successfully"
    })
}

   


module.exports = {
    register,
    login,
    logout,
    handleRefreshToken
}