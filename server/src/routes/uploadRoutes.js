const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Cloudinary Upload Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Image upload failed',
                error: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            console.log('Upload successful:', req.file.path);

            res.json({
                success: true,
                message: 'Image uploaded successfully',
                imageUrl: req.file.path
            });
        } catch (error) {
            console.error('Route Handler Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    });
});

module.exports = router;
