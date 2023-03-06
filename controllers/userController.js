const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const Coupon = require('../models/CouponModel')
const Order = require('../models/OrderModel')
const uniqid = require('uniqid')
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

const useCoupon = async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user
    validateMongoId(_id)
    const checkCoupon =  await Coupon.findOne({ name: coupon})
    if(checkCoupon === null) {
        throw new AppError.BadRequestError("Invalid Coupon")
    }
    
    let { cartTotal } = await Cart.findOne({
        orderedBy: _id
    }).populate("products.product", "_id title price priceAfterDiscount")

    let priceAfterDiscount = (cartTotal - (cartTotal * checkCoupon.discount) / 100).toFixed(2)

    await Cart.findOneAndUpdate(
        { orderedBy: _id },
        { priceAfterDiscount : priceAfterDiscount },
        { new: true }
    ).exec()

    res.status(StatusCodes.OK).json({
        message : "Coupon applied",
        discount: checkCoupon.discount,
        priceAfterDiscount: priceAfterDiscount
    })
}

const createOrder = async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user
    validateMongoId(_id)
    if(!COD) {
        throw new AppError.BadRequestError("Create Cash order failed")
    }
    let userCart = await Cart.findOne({
        orderedBy: _id
    })
    let finalPrice = 0;
    if (couponApplied && userCart.priceAfterDiscount) {
        finalPrice = userCart.priceAfterDiscount;
        console.log(userCart.priceAfterDiscount);
    }
    else {
        finalPrice = userCart.cartTotal;
    }
    let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
            id: uniqid(),
            amount: finalPrice,
            currency: "usd",
            status: "Cash On delivery",
            created: Date.now(),
            payment_method_types: ["cash"]
        },
        orderedBy: _id,
        orderStatus: "Cash on delivery"
    }).save();
    // decrement quantity, increment sold
    let bulkOption = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    }
    )
    const updated = await Product.bulkWrite(bulkOption, {})
    res.status(StatusCodes.OK).json({
        message : "Order created",
        order : newOrder,
        updated
    })

}

const getOrders = async (req, res) => {
    const { _id } = req.user
    validateMongoId(_id)
    const userOrders = await Order.findOne({
        orderedBy: _id
    }).populate("products.product", "_id title price priceAfterDiscount quantity sold images")
    res.status(StatusCodes.OK).json({
        message : "Orders",
        order : userOrders
    })
}

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    validateMongoId(orderId)
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus,
            paymentIntent: {
                status: orderStatus
             },
        },
        { new: true }
    ).exec()

    res.status(StatusCodes.OK).json({
        message : "Order status updated",
        updatedOrder
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
    getUserCart,
    emptyUserCart,
    useCoupon,
    createOrder,
    getOrders,
    updateOrderStatus
};
