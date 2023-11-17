const Brand = require('./brand.model');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../../../errors');

const createBrand = async (req, res) => {
  const newBrand = await Brand.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    newBrand,
  });
};

const updateBrand = async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    brand,
  });
};

const getSingleBrand = async (req, res) => {
  const { id } = req.params;

  const getBrand = await Brand.findById(id);
  if (!getBrand) {
    throw new NotFoundError('Category not found');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    getBrand,
  });
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new NotFoundError('Brand not found');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Brand deleted successfully',
  });
};

const getAllBrands = async (req, res) => {
  const brands = await Brand.find();
  res.status(StatusCodes.OK).json({
    success: true,
    brands,
  });
};

module.exports = {
  createBrand,
  updateBrand,
  getSingleBrand,
  getAllBrands,
  deleteBrand,
};
