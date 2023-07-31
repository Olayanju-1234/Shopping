const router = require('express').Router()
const { createCategory,
    updateCategory,
    getSingleCategory,
    getAllCategories,   
    deleteCategory } = require('../controllers/productCategoryController')

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.route('/').
    post(authMiddleware, isAdmin, createCategory).
    get(getAllCategories)

router.route('/:id').
    put(authMiddleware, isAdmin, updateCategory).
    get(authMiddleware, getSingleCategory).
    delete(authMiddleware, isAdmin, deleteCategory)


module.exports = router