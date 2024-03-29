const Product = require('./product.model');
const User = require('../User/user.model');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../../errors');
const slugify = require('slugify');

const createProduct = async (req, res) => {
  // const { name, price, description, category, quantity, color, brand } = req.body;

  // if (!name || !price || !description || !category || !quantity || !color || !brand) {
  //     throw new BadRequestError('All fields are required')
  // }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  // upload images
  if (req.file) {
    req.body.images = req.file.path;
  }

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({
    message: 'Product created',
    product,
  });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  res.status(StatusCodes.OK).json({
    message: 'Product updated',
    product,
  });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  res.status(StatusCodes.OK).json({
    message: 'Product found',
    product,
  });
};

const getAllProducts = async (req, res) => {
  // Filtering
  const queryObject = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObject[el]);

  let queryStr = JSON.stringify(queryObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numProducts = await Product.countDocuments();
    if (skip >= numProducts) throw new NotFoundError('This page does not exist');
  }

  // Find the products
  const products = await query;
  res.status(StatusCodes.OK).json({
    message: 'All products',
    products,
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.status(StatusCodes.OK).json({
    message: 'Product deleted',
    product,
  });
};

const wishlist = async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;

  const user = await User.findById(_id);
  const inWishlist = user.wishlist.find((id) => id.toString() === productId);

  if (inWishlist) {
    user.wishlist.pull(productId);
    await user.save();
    res.status(StatusCodes.OK).json({
      message: 'Product removed from wishlist',
    });
  } else {
    user.wishlist.push(productId);
    await user.save();
    res.status(StatusCodes.OK).json({
      message: 'Product added to wishlist',
    });
  }
};

const rateProduct = async (req, res) => {
  const { _id } = req.user;
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  const rated = product.ratings.find((rate) => rate.postedBy.toString() === _id.toString());
  if (rated) {
    await Product.updateOne(
      { ratings: { $elemMatch: rated } },
      { $set: { 'ratings.$.star': rating, 'ratings.$.comment': comment } },
      { new: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          ratings: {
            star: rating,
            comment: comment,
            postedBy: _id,
          },
        },
      },
      { new: true }
    );
  }
  const getAllRatings = await Product.findById(productId);
  const ratings = getAllRatings.ratings.length;
  const sumOfRatings = getAllRatings.ratings.reduce((acc, item) => acc + item.star, 0);
  const actualRating = Math.round(sumOfRatings / ratings);
  const ratedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      totalRatings: actualRating,
    },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    message: 'Product rated',
    ratedProduct,
  });
};

module.exports = {
  createProduct,
  getSingleProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  wishlist,
  rateProduct,
};
