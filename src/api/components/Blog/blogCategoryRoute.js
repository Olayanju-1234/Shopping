const express = require('express');
const router = express.Router();

const { createCategory,
        updateCategory,
        getSingleCategory,
        getAllCategories,   
        deleteCategory 
} = require('./blogCategoryController')

const { authMiddleware, isAdmin } = require('../../Middlewares/authMiddleware')

router.route('/').
    post(authMiddleware, isAdmin, createCategory).
    get(getAllCategories)

router.route('/:id').
    put(authMiddleware, isAdmin, updateCategory).
    get(authMiddleware, getSingleCategory).
    delete(authMiddleware, isAdmin, deleteCategory)


module.exports = router