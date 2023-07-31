const express = require('express');
const router = express.Router();

const { createBlog,
        updateBlog,
        getSingleBlog,
        getAllBlogs,
        deleteBlog,
        likePost,
        dislikePost,
        uploadImages } = require('./blogController')

const { uploadImage,  
        resizeBlogImage} = require('../../Middlewares/uploadImage');

const { isAdmin, 
        authMiddleware } = require('../../Middlewares/authMiddleware')

router.route('/').
    post(authMiddleware, isAdmin, createBlog).
    get(getAllBlogs)

router.route('/upload/images/:id').
    put(authMiddleware, isAdmin, 
        uploadImage.array("images", 10), resizeBlogImage, 
        uploadImages);

router.route('/likes').
    put(authMiddleware, likePost)
router.route('/dislikes').
    put(authMiddleware, dislikePost)
    
router.route('/:id').
    put(authMiddleware, isAdmin, updateBlog).
    get(getSingleBlog).
    delete(authMiddleware, isAdmin, deleteBlog)



module.exports = router