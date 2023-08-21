const Brand = require('./brand.model')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../../errors')

const createBrand = async (req, res) => {
    const newBrand = await Brand.create(req.body)
    res.status(StatusCodes.CREATED).json({
        success: true,
        newBrand
    })
}

const updateBrand = async (req, res) => {
    const { id } = req.params
    
    const updateBrand = await Brand.findByIdAndUpdate(id, {
        $set: req.body
    }, { new: true });
    res.status(StatusCodes.OK).json({
        success: true,
        updateBrand
    })
}

const getSingleBrand = async (req, res) => {
    const { id } = req.params
    
    const getBrand = await Brand.findById(id)
    if (!getBrand) {
        throw new NotFoundError("Category not found")
    }
    res.status(StatusCodes.OK).json({
        success: true,
        getBrand
    })
}

const deleteBrand = async (req, res) => {
    const { id } = req.params
    
    const deleteBrand = await Brand.findByIdAndDelete(id)
    if (!deleteBrand) {
        throw new NotFoundError("Brand not found")
    }
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Brand deleted successfully"
    })
}

const getAllBrands = async (req, res) => {
    const brands = await Brand.find()
    res.status(StatusCodes.OK).json({
        success: true,
        brands
    })
}

module.exports = { 
    createBrand,
    updateBrand,
    getSingleBrand,
    getAllBrands,
    deleteBrand
}