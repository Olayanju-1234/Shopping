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
        authenticateUser } = require('../../middlewares/authMiddleware')

router.route('/').
    post(authenticateUser, isAdmin, uploader.single('images'), createBlog).
    get(getAllBlogs)

router.route('/likes').
    put(authenticateUser, likePost)

router.route('/dislikes').
    put(authenticateUser, dislikePost)
    
router.route('/:id').
    put(authenticateUser, isAdmin, updateBlog).
    get(getSingleBlog).
    delete(authenticateUser, isAdmin, deleteBlog)

module.exports = router