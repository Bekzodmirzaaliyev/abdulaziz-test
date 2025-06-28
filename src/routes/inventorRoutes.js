const express = require('express')
const router = express.Router()
const { createProduct, addStock } = require('../controllers/inventorController')

router.post('/create', createProduct )
router.put('/add-stock/:productId', addStock)

module.exports = router