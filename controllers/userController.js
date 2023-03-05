const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
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

const saveAddress = async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id);

    const user = await User.findByIdAndUpdate( _id, {
        $set: {
            address: req.body.address
        }
    }, { new: true });
    // Check if user exists
    if (!user) {
        throw new AppError.NotFoundError("User not found")
    }
    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
        throw new AppError.BadRequestError("Please provide a valid data")
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

const getWishlist = async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).populate('wishlist');
    res.status(StatusCodes.OK).json({
        message : "Wishlist",
        wishlist : user.wishlist
    })
}

const userCart = async (req, res, next) => {
    const { cart } = req.body
    const { _id } = req.user
    validateMongoId(_id);
    let products = [];
    const user = await User.findById(_id)
    // check if user already have a product in cart
    const cartExists = await Cart.findOne({ orderedBy: user._id})
    if (cartExists) {
        cartExists.remove()
    }

    for (let i = 0; i < cart.length; i++) {
        let item = {};
        item.product = cart[i]._id;
        item.count = cart[i].count;
        item.color = cart[i].color;

        let getPrice = await Product.findById(cart[i]._id).select("price").exec()
        item.price = getPrice.price;
        products.push(item)
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count
    }
    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id
    }).save()
    res.status(StatusCodes.OK).json({
        message : "Cart saved",
        cart : newCart
    })
} 

const getUserCart = async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id);
    const cart = await Cart.findOne({
        orderedBy: _id
    }).populate("products.product", "_id title price totalAfterDiscount")

    const { products, cartTotal, totalAfterDiscount } = cart;



    res.status(StatusCodes.OK).json({
        message : "Cart",
        cart : { products, cartTotal, totalAfterDiscount }

    })

}

module.exports = {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    blockUser,
    unblockUser,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart
};
