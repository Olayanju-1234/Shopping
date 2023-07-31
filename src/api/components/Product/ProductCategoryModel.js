const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
} , { timestamps: true })

module.exports = mongoose.model('ProductCategory', productCategorySchema)
