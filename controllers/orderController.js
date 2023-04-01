const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const Cart = require('../models/CartModel')

const uniqid = require('uniqid')
const AppError = require('../errors/errors')

const { StatusCodes } = require('http-status-codes')
const validateMongoId = require('../utils/validateMongoId')


const createOrder = async (req, res) => {
    const {
        body: {COD, couponApplied},
        user:{ _id }
    } = req;

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
    })
    
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
    const {
        params: { orderId },
        body: { orderStatus }
    } = req

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
    createOrder,
    getOrders,
    updateOrderStatus
}