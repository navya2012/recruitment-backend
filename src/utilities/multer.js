
const multer = require('multer')
const path = require('path');


const uploadsDir = path.join(__dirname, '../uploads/images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
      }
})

const uploadFiles = multer({ storage: storage })

module.exports = {
    uploadFiles
}