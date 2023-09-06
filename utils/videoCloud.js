const cloudinary = require('cloudinary')
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadVideo = async(fileToUploadVideo) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploadVideo, (result) => {
            resolve({
                url: result.secure_url
            },
            {
                resource_type: "video"
                
            }
            )
        })
    })
}



module.exports = { uploadVideo }