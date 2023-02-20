const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
require('express-async-errors');
const { StatusCodes } = require('http-status-codes')
const AppError = require('../errors/errors')


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

    const usernameExists = await User.findOne({username})
    if(usernameExists) {
        throw new AppError.BadRequestError("Username taken")
    }

    const newUser = await User.create({
        firstName, lastName, email, username, password
    })

    res.status(StatusCodes.CREATED).json({
        success : true
    })

}

const login = async (req, res) => {
    
}

const logout = async (req, res) => {
    
}

module.exports = {
    register,
    login,
    logout
}