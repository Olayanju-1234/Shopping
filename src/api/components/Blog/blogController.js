const Blog = require('./BlogModel')
const { StatusCodes } = require('http-status-codes')
const AppError = require('../../Errors/AppError')
const validateMongoId = require('../../../utils/validateMongoId')
const { uploadImage } = require('../../../utils/cloudinary');
const fs = require('fs')

const createBlog = async (req, res) => {
    const newBlog = await Blog.create(req.body)
    res.status(StatusCodes.CREATED).json({
        success: true,
        newBlog
    })
}

const updateBlog = async (req, res) => {
    const { id } = req.params
    validateMongoId(id)
    const updateBlog = await Blog.findByIdAndUpdate(id, {
        $set: req.body
    }, { new: true });

    res.status(StatusCodes.OK).json({
        success: true,
        updateBlog
    })
}

const getSingleBlog = async (req, res) => {
    const { id } = req.params
    validateMongoId(id)
    const getBlog = await Blog.findById(id).populate('likes', 'dislikes');
    if (!getBlog) {
        throw new AppError.NotFoundError("Blog not found")
    }
    await Blog.findByIdAndUpdate(id, {
        $inc : {
            viewsCount: 1
        }},
        {
            new : true
        }
    )
    res.status(StatusCodes.OK).json({
        success: true,
        getBlog
    })
}

const getAllBlogs = async (req, res) => {
    // Filtering
    const queryObject = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObject[el])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    let query = Blog.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 10
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    // Executing query
    const blogs = await query
    res.status(StatusCodes.OK).json({
        success: true,
        blogs
    })
}

const likePost = async (req, res) => {
    const { postId } = req.body
    validateMongoId(postId)
    // Get blog
    const blog = await Blog.findById(postId)
    // Get user
    const loggedInUser = req.user._id
    // Check if user already liked the post
    const isLiked = blog.isLiked;
    // Check if user already disliked the post
    const isDisliked = blog.dislikes.find(
        ((userId) => userId.toString()===loggedInUser.toString())
    );
        
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(postId, {
            $pull: {
                dislikes: InUser
            },
            isDisliked: false
        },
        {new: true}
    );
    res.status(StatusCodes.OK).json({
        success: true,
        blog
    })
    }
    
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(postId, {
            $pull: {
                likes: loggedInUser
            },
            isLiked: false
        },
        {new: true}
    );
    res.status(StatusCodes.OK).json({
        success: true,
        blog
    })
    } else {
        const blog = await Blog.findByIdAndUpdate(postId, {
            $push: {
                likes: loggedInUser
            },
            isLiked: true
        },
        {new: true}
    );
    res.status(StatusCodes.OK).json({
        success: true,
        blog,
    })
    }
}

const dislikePost = async (req, res) => {
    const { postId } = req.body
    validateMongoId(postId)
    // Get blog
    const blog = await Blog.findById(postId)
    // Get user
    const loggedInUser = req.user._id
    // Check if user already liked the post
    const isDisliked = blog.isDisliked;
    // Check if user already disliked the post
    const isLiked = blog.likes.find(
        ((userId) => userId.toString()===loggedInUser.toString())
    );
        
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(postId, {
            $pull: {
                likes: loggedInUser
            },
            isLiked: false
        },
        {new: true}
    );
    res.status(StatusCodes.OK).json({
        success: true,
        blog
    })
    }
    
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(postId, {
            $pull: {
                dislikes: loggedInUser
            },
            isDisliked: false
        },
        {new: true}
    );
    res.status(StatusCodes.OK).json({
        success: true,
        blog
    })
    } else {
        const blog = await Blog.findByIdAndUpdate(postId, {
            $push: {
                dislikes: loggedInUser
            },
            isDisliked: true
        },
        {new: true}
    );
    res.status(StatusCodes.OK).json({
        success: true,
        blog,
    })
    }
}

const deleteBlog = async (req, res) => {
    const { id } = req.params
    validateMongoId(id)
    const deleteBlog = await Blog.findByIdAndDelete(id)
    if (!deleteBlog) {
        throw new AppError.NotFoundError("Blog not found")
    }
    res.status(StatusCodes.OK).json({
        success: true,
        message : "Blog deleted successfully"
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
    const blog = await Blog.findByIdAndUpdate(id, {
        images: urls.map(url => {return  url })
    }, { new: true })
    res.status(StatusCodes.OK).json({
        message : "Post images uploaded",
        blog
    })
}

module.exports = {
    createBlog,
    updateBlog,
    getSingleBlog,
    getAllBlogs,
    deleteBlog,
    likePost,
    dislikePost,
    uploadImages
}