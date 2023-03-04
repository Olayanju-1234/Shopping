const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadImage = async (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, (result) => {
            resolve({
                url: result.secure_url
            })
        }, {
            resource_type: 'auto',
        })
    }
    )
}

module.exports = { uploadImage }
