const Product = require('./productModel');
const User = require('../User/UserModel');
const { StatusCodes } = require('http-status-codes')
const AppError = require('../../Errors/AppError')
const validateMongoId = require('../../Utils/validateMongoId')
const slugify = require('slugify');
const { uploadImage } = require('../../Utils/cloudinary');
const fs = require('fs');

// Create Product
const createProduct = async (req, res) => {
    if (req.body.name) {
        req.body.slug = slugify(req.body.name)
    }
    const newProduct = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({
        message : "Product created",
        newProduct
    })
}

// update product
const updateProduct = async (req, res) => { 
    if (req.body.name) {
        req.body.slug = slugify(req.body.name)
    }

    const { id } = req.params

    const updateProduct = await Product.findByIdAndUpdate(id, {
        $set: req.body
    }, { new: true });

    if (!updateProduct) {
        throw new AppError.NotFoundError("Product not found")
    }

    res.status(StatusCodes.OK).json({
        message : "Product updated",
        updateProduct
    })

}

// get a product
const getSingleProduct = async (req, res) => {
    const { id } = req.params
    
    const product = await Product.findById(id);
    res.status(StatusCodes.OK).json({
        message : "Product found",
        product
    })
}

// get all products
const getAllProducts = async (req, res) => {
    // Filtering
    const queryObject = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObject[el])

    let queryStr = JSON.stringify(queryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
  
    let query = Product.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    } else {
        query = query.select('-__v')
    }

    // Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
        const numProducts = await Product.countDocuments()
        if (skip >= numProducts) throw new AppError.NotFoundError('This page does not exist')
    }

    // Find the products
    const products = await query;
    res.status(StatusCodes.OK).json({
        message : "All products",
        products
    })
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        throw new AppError.NotFoundError("Product not found")
    }
    res.status(StatusCodes.OK).json({
        message : "Product deleted",
        product
    })
}

const wishlist = async (req, res) => {
    const { _id } = req.user
    const { productId } = req.body
    
    const user = await User.findById(_id);
    const inWishlist = user.wishlist.find(id => id.toString() === productId)
    if (inWishlist) {
        let user = await User.findByIdAndUpdate(_id, {
            $pull: { wishlist: productId }
        }, { new: true })
        res.status(StatusCodes.OK).json({
            message : "Product removed from wishlist",
            user
        })
    } else {
        let user = await User.findByIdAndUpdate(_id, {
            $push: {wishlist: productId}
        }, { new: true })
        res.status(StatusCodes.OK).json({
            message : "Product added to wishlist",
            user
    })
}
}

const rating = async (req, res) => {
    const { _id } = req.user
    const { productId, rating, comment } = req.body

    const product = await Product.findById(productId);
    const rated = product.ratings.find(rating => rating.postedBy.toString() === _id.toString())
    if (rated) {
        await Product.updateOne(
            { ratings: { $elemMatch: rated } },
            { $set: { "ratings.$.star": rating, "ratings.$.comment": comment } },
            { new: true }
        )
    } else {
        await Product.findByIdAndUpdate(productId, {
            $push: { ratings: { 
                star: rating,
                comment: comment, 
                postedBy: _id } }
        }, { new: true })
    }
    const getAllRatings = await Product.findById(productId)
    let ratings = getAllRatings.ratings.length
    let sumOfRatings = getAllRatings.ratings.reduce((acc, item) => {
        return acc + item.star
    }
    , 0)
    let actualRating = Math.round(sumOfRatings / ratings)
    let ratedProduct = await Product.findByIdAndUpdate(productId, {
        totalRatings: actualRating
        }, { new: true }) 
    res.status(StatusCodes.OK).json({
        message : "Product rated",
        ratedProduct
    })
}

const uploadImages = async (req, res) => {
    const { id } = req.params
    validateMongoId(id);

    const uploader = async (path) => await uploadImage(path, 'images')
    const urls = []
    const files = req.files;
    for (const file of files) {
        const { path } = file
        const newPath = await uploader(path);
        urls.push(newPath)
        fs.unlinkSync(path)
        
    }
    const product = await Product.findByIdAndUpdate(id, {
        images: urls.map(url => {return  url })
    }, { new: true })

    res.status(StatusCodes.OK).json({
        message : "Product images uploaded",
        product
    })
}

module.exports = {
    createProduct,
    getSingleProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
    wishlist,
    rating,
    uploadImages
}