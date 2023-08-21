const express = require('express')
const router = express.Router();

const authRoute = require('./Auth/auth.route')
const blogCategoryRoute = require('./Blog/blog-category.route')
const blogRoute = require('./Blog/blog.route')
const brandRoute = require('./Brand/brand.route')
const couponRoute = require('./Coupon/coupon.route')
const productCategoryRoute = require('./Product/product-category.route')
const productRoute = require('./Product/product.route')
const userRoute = require('./User/user.route')

router.use('/auth', authRoute)
router.use('/blog-category', blogCategoryRoute)
router.use('/blog', blogRoute)
router.use('/brand', brandRoute)
router.use('/coupon', couponRoute)
router.use('/product-category', productCategoryRoute)
router.use('/product', productRoute)
router.use('/user', userRoute)

module.exports = router
