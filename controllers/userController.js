const User = require('../models/UserModel');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/errors')
require('express-async-errors');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    // If no user
    if (users.length < 1) {
        throw new AppError.NotFoundError("No users found")
    }
    res.status(StatusCodes.OK).json({
        message : "All users",
        users });
};
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    // If no user
    if (!user) {
        throw new AppError.NotFoundError("No user with this ID found")
    }

    res.status(StatusCodes.OK).json({ 
        message : "User found",
        user });
};
const updateProfile = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        firstName:req?.body?.firstName,
        lastName:req?.body?.lastName,
        email:req?.body?.email,
        username:req?.body?.username
    }, {
        new: true
    })
    // Check if user exists
    if (!user) {
        throw new AppError.NotFoundError("User not found")
    }

    res.status(StatusCodes.OK).json({
        message : true,
        user
    })


};
const deleteUser = async (req, res) => {
    
};

module.exports = {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser
};
