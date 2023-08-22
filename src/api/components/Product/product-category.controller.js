const Category = require('./product-category.model');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../../errors');

const createCategory = async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    newCategory,
  });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    category,
  });
};

const getSingleCategory = async (req, res) => {
  const { id } = req.params;

  const getCategory = await Category.findById(id);
  if (!getCategory) {
    throw new NotFoundError('Category not found');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    getCategory,
  });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Category deleted successfully',
  });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(StatusCodes.OK).json({
    success: true,
    categories,
  });
};

module.exports = {
  createCategory,
  updateCategory,
  getSingleCategory,
  getAllCategories,
  deleteCategory,
};
