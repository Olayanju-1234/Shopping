const express = require('express');
const router = express.Router();

const { createBlog,
        updateBlog,
        getSingleBlog,
        getAllBlogs,
        deleteBlog,
        likePost,
        dislikePost,
 } = require('./blogController')

 const uploader = require('../../services/upload/cloudinary');

const { isAdmin, 
        authMiddleware } = require('../../Middlewares/authMiddleware')

router.route('/').
    post(authMiddleware, isAdmin, uploader.single('images'), createBlog).
    get(getAllBlogs)

router.route('/likes').
    put(authMiddleware, likePost)

router.route('/dislikes').
    put(authMiddleware, dislikePost)
    
router.route('/:id').
    put(authMiddleware, isAdmin, updateBlog).
    get(getSingleBlog).
    delete(authMiddleware, isAdmin, deleteBlog)

module.exports = router