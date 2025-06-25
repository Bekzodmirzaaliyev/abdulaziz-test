const express = require('express');
const router = express.Router();

const { addStock, getAllStocks } = require('../controllers/CommonController');

router.post('/add', addStock);
router.get('/all', getAllStocks);
module.exports = router;
