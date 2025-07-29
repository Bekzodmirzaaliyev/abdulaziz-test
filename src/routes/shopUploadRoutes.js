const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadImage');

router.post('/image', (req, res, next) => {
  req.destination = 'banner'; // 👈 bu safar "banner" papkasiga
  next();
}, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.status(200).json({
    path: `/uploads/banner/${req.file.filename}`,
    message: 'Shop banner uploaded successfully',
  });
});

module.exports = router;
