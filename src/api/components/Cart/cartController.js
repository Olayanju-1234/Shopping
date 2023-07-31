const Cart = require('./CartModel')
const User = require('../User/UserModel')
const Product = require('../Product/productModel')
const { StatusCodes } = require('http-status-codes')
const AppError = require('../../Errors/AppError')
const validateMongoId = require('../../Utils/validateMongoId')

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
    }).populate("products.product", "_id title price priceAfterDiscount")

    if(!cart) {
        throw new AppError.NotFoundError("Cart is empty")
    }

    const { products, cartTotal, priceAfterDiscount } = cart;

    res.status(StatusCodes.OK).json({
        message : "Cart",
        cart : { products, cartTotal, priceAfterDiscount }

    })
}

const emptyUserCart = async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id);
    await Cart.findOneAndRemove({
        orderedBy: _id
    })
    res.status(StatusCodes.OK).json({
        message : "Cart is empty",
    })
}


module.exports = {
    userCart,
    getUserCart,
    emptyUserCart
}