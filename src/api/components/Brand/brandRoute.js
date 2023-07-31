const router = require('express').Router()
const { createBrand,
    updateBrand,
    getSingleBrand,
    getAllBrands,   
    deleteBrand } = require('../controllers/brandController')

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.route('/').
    post(authMiddleware, isAdmin, createBrand).
    get(getAllBrands)

router.route('/:id').
    put(authMiddleware, isAdmin, updateBrand).
    get(authMiddleware, getSingleBrand).
    delete(authMiddleware, isAdmin, deleteBrand)


module.exports = router