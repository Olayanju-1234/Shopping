const router = require('express').Router()
const { createBlog,
        updateBlog,
        getSingleBlog,
        getAllBlogs,
        deleteBlog,
        likePost,
        dislikePost } = require('../controllers/blogController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')


router.route('/').
    post(authMiddleware, isAdmin, createBlog).
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