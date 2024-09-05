
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// const uploadImage = async (file) => {       
//     console.log('cloudinary', file)
//     try {
//         const result = await cloudinary.uploader.upload(file);
//         console.log('result', result)
//         return result.secure_url; 
//     } catch (error) {
//         throw new Error('Image upload failed: ' + error.message);
//     }
// };


module.exports = {
   // uploadImage,
    cloudinary
} 