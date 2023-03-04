const router = require('express').Router()

const { createBlog,
        updateBlog,
        getSingleBlog,
        getAllBlogs,
        deleteBlog,
        likePost,
        dislikePost,
        uploadImages } = require('../controllers/blogController')

const { uploadImage,  
        resizeBlogImage} = require('../middlewares/uploadImage');

const { isAdmin, 
        authMiddleware } = require('../middlewares/authMiddleware')

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