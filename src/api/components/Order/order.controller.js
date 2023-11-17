const Order = require('./order.model');
const Cart = require('../Cart/cart.model');
const Product = require('../Product/product.model');

const uniqid = require('uniqid');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../../errors');

const createOrder = async (req, res) => {
  const {
    body: { COD, couponApplied },
    user: { _id },
  } = req;

  if (!COD) {
    throw new BadRequestError('Create Cash order failed');
  }

  const userCart = await Cart.findOne({
    orderedBy: _id,
  });

  let finalPrice = 0;
  if (couponApplied && userCart.priceAfterDiscount) {
    finalPrice = userCart.priceAfterDiscount;
    console.log(userCart.priceAfterDiscount);
  } else {
    finalPrice = userCart.cartTotal;
  }
  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      amount: finalPrice,
      currency: 'usd',
      status: 'Cash On delivery',
      created: Date.now(),
      payment_method_types: ['cash'],
    },
    orderedBy: _id,
    orderStatus: 'Cash on delivery',
  }).save();
  // decrement quantity, increment sold
  const bulkOption = userCart.products.map((item) => ({
    updateOne: {
      filter: { _id: item.product._id },
      update: { $inc: { quantity: -item.count, sold: +item.count } },
    },
  }));

  const updated = await Product.bulkWrite(bulkOption, {});
  res.status(StatusCodes.OK).json({
    message: 'Order created',
    order: newOrder,
    updated,
  });
};

const getOrders = async (req, res) => {
  const { _id } = req.use;
  const userOrders = await Order.findOne({
    orderedBy: _id,
  }).populate('products.product', '_id title price priceAfterDiscount quantity sold images');
  res.status(StatusCodes.OK).json({
    message: 'Orders',
    order: userOrders,
  });
};

const updateOrderStatus = async (req, res) => {
  const {
    params: { orderId },
    body: { orderStatus },
  } = req;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus,
      paymentIntent: {
        status: orderStatus,
      },
    },
    { new: true }
  ).exec();

  res.status(StatusCodes.OK).json({
    message: 'Order status updated',
    updatedOrder,
  });
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
