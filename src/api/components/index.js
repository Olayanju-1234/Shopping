const express = require('express')
const router = express.Router();

const authRoute = require('./Auth/authRoute')
const blogCategoryRoute = require('./Blog/blogCategoryRoute')
const blogRoute = require('./Blog/blogRoute')
const brandRoute = require('./Brand/brandRoute')
const couponRoute = require('./Coupon/couponRoute')
const productRoute = require('./Product/productRoute')
const userRoute = require('./User/userRoute')

router.use('/auth', authRoute)
router.use('/blog-category', blogCategoryRoute)
router.use('/blog', blogRoute)
router.use('/brand', brandRoute)
router.use('/coupon', couponRoute)
router.use('/product', productRoute)
router.use('/user', userRoute)

module.exports = router
