const User = require('../models/UserModel');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/errors')
require('express-async-errors');
const validateMongoId = require('../utils/validateMongoId');


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
    const { id } = req.params
    // Validate id
    validateMongoId(id);
    
    const user = await User.findById(id);
    // If no user
    if (!user) {
        throw new AppError.NotFoundError("No user with this ID found")
    }

    res.status(StatusCodes.OK).json({ 
        message : "User found",
        user });
};

const updateProfile = async (req, res) => {
    // id
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate( _id, {
        $set: req.body
    }, { new: true });
    console.log(req.user);
    // Check if user exists
    if (!user) {
        throw new AppError.NotFoundError("User not found")
    }
    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
    }
    // Check if email || username is taken
    const usernameOrEmailExists = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (usernameOrEmailExists) {
        throw new AppError.BadRequestError("Username or email already exists")
    }

    res.status(StatusCodes.OK).json({
        success : true,
        user
    })


};

const deleteUser = async (req, res) => {
    const { id } = req.params
    // Validate id
    validateMongoId(id);
    const user = await User.findByIdAndDelete(id);
    // Check if user exists
    if (!user) {
        throw new AppError.NotFoundError("User not found")
    }

    res.status(StatusCodes.OK).json({
        message : true,
        user
    })
};

const blockUser = async (req, res) => {
    const { id } = req.params
    // Validate id
    validateMongoId(id);

    const block = await User.findByIdAndUpdate(id, {
        $set: { isBlocked: true }
    }, { new: true })
    // Check if user exists
    if (!block) {
        throw new AppError.NotFoundError("User not found")
    }
    // Check if user is already blocked
    // if (block.isBlocked === true) {
    //     throw new AppError.BadRequestError("User is already blocked")
    // }
    res.status(StatusCodes.OK).json({
        message : "User blocked",
    })
};

const unblockUser = async (req, res) => {
    const { id } = req.params
    // Validate id
    validateMongoId(id);
    const unblock = await User.findByIdAndUpdate(id, {
        $set: { isBlocked: false }
    }, { new: true })
    // Check if user exists
    if (!unblock) {
        throw new AppError.NotFoundError("User not found")
    }
    // Check if user is already unblocked
    // if (unblock.isBlocked === false) {
    //     throw new AppError.BadRequestError("User is already unblocked")
    // }
    res.status(StatusCodes.OK).json({
        message : "User unblocked",
    })
};

module.exports = {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    blockUser,
    unblockUser
};
