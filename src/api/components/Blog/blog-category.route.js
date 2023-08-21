const express = require('express');
const router = express.Router();

const { createCategory,
        updateCategory,
        getSingleCategory,
        getAllCategories,   
        deleteCategory 
} = require('./blog-category.controller')

const { authenticateUser, isAdmin } = require('../../middlewares/authenticate')

router.route('/').
    post(authenticateUser, isAdmin, createCategory).
    get(getAllCategories)

router.route('/:id').
    put(authenticateUser, isAdmin, updateCategory).
    get(authenticateUser, getSingleCategory).
    delete(authenticateUser, isAdmin, deleteCategory)


module.exports = router