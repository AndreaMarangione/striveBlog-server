const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const blogCloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Blog Post Images',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.originalname
    }
})

const authorsCloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Authors Images',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.originalname
    }
})

const blogCloudUpload = multer({ storage: blogCloudStorage });
const authorsCloudUpload = multer({ storage: authorsCloudStorage });

module.exports = { blogCloudUpload, authorsCloudUpload };
