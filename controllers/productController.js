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
    const getAll = await Product.find();
    res.status(StatusCodes.OK).json({
        message : "All products",
        getAll
    })
}


module.exports = {
    createProduct,
    getSingleProduct,
    updateProduct,
    getAllProducts
}