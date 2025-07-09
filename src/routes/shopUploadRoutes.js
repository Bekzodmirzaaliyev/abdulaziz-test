const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadImage');


router.post('/banner', upload.single('banner'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
        path: `/uploads/banner/${req.file.filename}`,
        message: 'Image uploaded successfully',
    });
})

module.exports = router