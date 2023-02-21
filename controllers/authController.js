const User = require('../models/UserModel')
require('express-async-errors');
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const AppError = require('../errors/errors')


const register = async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body

    // token
    const accessToken = jwt.sign( {username}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60});

    // Validate fields
    if (!email || !username || !password) {
        throw new AppError.BadRequestError('Make sure all required fields are filled')
    }

    // Check if a user exists already
    const emailExists = await User.findOne({email})
    if(emailExists) {
        throw new AppError.BadRequestError("Email taken")
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
        user: newUser,
        accessToken
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

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, usernameExists.password)
    if(!isPasswordCorrect) {
        throw new AppError.BadRequestError("Incorrect password")
    }

    res.status(StatusCodes.OK).json({
        success : true,
        user: usernameExists
    })
}

const logout = async (req, res) => {
    res.status(StatusCodes.OK).json({
        success : true,
        message: "Logged out"
    })
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: 60 * 60});
  }

module.exports = {
    register,
    login,
    logout
}