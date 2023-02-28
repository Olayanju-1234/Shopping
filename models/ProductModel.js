const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    brand : {
        type: String,
        enum: ["Apple", "Samsung", "Lenovo", "Microsoft", "Asus", "Dell", "HP", "Acer", "LG"]
    },
    sold : {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        enum : ['red','green','blue','white','black','yellow','orange','purple','pink','brown','grey','silver','gold','multicolor'],
    },
    ratings: [
        {
            star: Number,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

