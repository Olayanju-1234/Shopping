const Product = require('../models/ProductModel');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/errors')
require('express-async-errors');
const validateMongoId = require('../utils/validateMongoId');
const slugify = require('slugify');

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
  
    const query = Product.find(JSON.parse(queryStr))

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
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
        const numProducts = await Product.countDocuments()
        if (skip >= numProducts) throw new Error('This page does not exist')
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


module.exports = {
    createProduct,
    getSingleProduct,
    updateProduct,
    getAllProducts,
    deleteProduct
}