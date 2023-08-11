const Cart = require('./CartModel')
const User = require('../User/UserModel')
const Product = require('../Product/productModel')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../../errors/')

const userCart = async (req, res, next) => {
    const { cart } = req.body
    const { _id } = req.user
    
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
    
    const cart = await Cart.findOne({
        orderedBy: _id
    }).populate("products.product", "_id title price priceAfterDiscount")

    if(!cart) {
        throw new NotFoundError("Cart is empty")
    }

    const { products, cartTotal, priceAfterDiscount } = cart;

    res.status(StatusCodes.OK).json({
        message : "Cart",
        cart : { products, cartTotal, priceAfterDiscount }

    })
}

const emptyUserCart = async (req, res) => {
    const { _id } = req.user;
    
    await Cart.findOneAndRemove({
        orderedBy: _id
    })
    res.status(StatusCodes.OK).json({
        message : "Cart is empty",
    })
}

const clearCart = async (req, res) => {
    const { _id } = req.user;

    acceptPayment: async (req, res) => {
        try {
            const email = req.body.email;
            const amount = req.body.amount;

            // params
            const params = JSON.stringify({
                "email": email,
                "amount": amount * 100,
            });

            // options
            const options = {
                hostname: 'api.paystack.co',
                path: '/transaction/initialize',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            };

            // request
            const request = https.request(options, (response) => {
                response.on('data', (data) => {
                    const { authorization_url } = JSON.parse(data);
                    res.redirect(authorization_url);
                });
            }
            );

            request.write(params);
            request.end();
        }
        catch (error) {
            console.log(error);
        }
    }
}


module.exports = {
    userCart,
    getUserCart,
    emptyUserCart
}