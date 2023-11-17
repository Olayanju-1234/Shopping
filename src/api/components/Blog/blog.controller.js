const Blog = require('./blog.model');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../../../errors');

const createBlog = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    throw new BadRequestError('All fields are required');
  }

  // upload images
  if (req.file) {
    req.body.images = req.file.path;
  }

  const blog = await Blog.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    blog,
  });
};

const updateBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    blog,
  });
};

const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  const getBlog = await Blog.findById(id).populate('likes', 'dislikes');
  if (!getBlog) {
    throw new NotFoundError('Blog not found');
  }
  await Blog.findByIdAndUpdate(
    id,
    {
      $inc: {
        viewsCount: 1,
      },
    },
    {
      new: true,
    }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    getBlog,
  });
};

const getAllBlogs = async (req, res) => {
  // Filtering
  const queryObject = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObject[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = Blog.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Executing query
  const blogs = await query;
  res.status(StatusCodes.OK).json({
    success: true,
    blogs,
  });
};

const likePost = async (req, res) => {
  const { postId } = req.body;
  const blog = await Blog.findById(postId);
  const loggedInUser = req.user._id;
  const { isLiked } = blog;
  const isDisliked = blog.dislikes.find((userId) => userId.toString() === loggedInUser.toString());

  if (isDisliked) {
    blog.dislikes.pull(loggedInUser);
    blog.isDisliked = false;
    blog.likes.push(loggedInUser);
    blog.isLiked = true;
    const updatedBlog = await blog.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedBlog,
    });
  }

  if (isLiked) {
    blog.likes.pull(loggedInUser);
    blog.isLiked = false;
    const updatedBlog = await blog.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedBlog,
    });
  } else {
    blog.likes.push(loggedInUser);
    blog.isLiked = true;
    const updatedBlog = await blog.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedBlog,
    });
  }
};

const dislikePost = async (req, res) => {
  const { postId } = req.body;

  const blog = await Blog.findById(postId);

  const loggedInUser = req.user._id;

  const { isDisliked } = blog;

  const isLiked = blog.likes.find((userId) => userId.toString() === loggedInUser.toString());

  if (isLiked) {
    blog.likes.pull(loggedInUser);
    blog.isLiked = false;
    blog.dislikes.push(loggedInUser);
    blog.isDisliked = true;
    const updatedBlog = await blog.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedBlog,
    });
  }

  if (isDisliked) {
    blog.dislikes.pull(loggedInUser);
    blog.isDisliked = false;
    const updatedBlog = await blog.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedBlog,
    });
  } else {
    blog.dislikes.push(loggedInUser);
    blog.isDisliked = true;
    const updatedBlog = await blog.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedBlog,
    });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    throw new NotFoundError('Blog not found');
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Blog deleted successfully',
  });
};

module.exports = {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likePost,
  dislikePost,
};
