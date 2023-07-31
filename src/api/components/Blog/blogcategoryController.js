const Blog = require('./BlogCategoryModel')
const { StatusCodes } = require('http-status-codes')
const AppError = require('../../Errors/AppError')
const validateMongoId = require('../../../utils/validateMongoId')

const createCategory = async (req, res) => {
    const newCategory = await Blog.create(req.body)
    res.status(StatusCodes.CREATED).json({
        success: true,
        newCategory
    })
}

const updateCategory = async (req, res) => {
    const { id } = req.params
    validateMongoId(id)
    const updateCategory = await Blog.findByIdAndUpdate(id, {
        $set: req.body
    }, { new: true });
    res.status(StatusCodes.OK).json({
        success: true,
        updateCategory
    })
}

const getSingleCategory = async (req, res) => {
    const { id } = req.params
    validateMongoId(id)
    const getCategory = await Blog.findById(id)
    if (!getCategory) {
        throw new AppError.NotFoundError("Category not found")
    }
    res.status(StatusCodes.OK).json({
        success: true,
        getCategory
    })
}

const deleteCategory = async (req, res) => {
    const { id } = req.params
    validateMongoId(id)
    const deleteCategory = await Blog.findByIdAndDelete(id)
    if (!deleteCategory) {
        throw new AppError.NotFoundError("Category not found")
    }
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Category deleted successfully"
    })
}

const getAllCategories = async (req, res) => {
    const categories = await Blog.find()
    res.status(StatusCodes.OK).json({
        success: true,
        categories
    })
}

module.exports = { 
    createCategory,
    updateCategory,
    getSingleCategory,
    getAllCategories,
    deleteCategory
}