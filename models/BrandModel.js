const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
} , { timestamps: true })

module.exports = mongoose.model('Brand', brandSchema)
