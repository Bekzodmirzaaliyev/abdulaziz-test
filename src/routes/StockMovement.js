const express = require('express');
const router = express.Router();
const { addStock, getAllStocks } = require('../controllers/CommonController');

/**
 * @swagger
 * tags:
 *   - name: StockMovement
 *     description: Mahsulot kirimlarini boshqarish (приход)
 */

/**
 * @swagger
 * /api/stock/add:
 *   post:
 *     tags:
 *       - StockMovement
 *     summary: Mahsulot kirimi qo'shish
 *     description: Yangi kirim (приход) yozuvini qo‘shadi va mavjud mahsulot `stock` qiymatini oshiradi.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: Mahsulot IDsi (MongoDB ObjectId)
 *               quantity:
 *                 type: number
 *                 description: Nechta mahsulot kirgan
 *               costPrice:
 *                 type: number
 *                 description: Kirimdagi xarajat narxi (so'm)
 *               salePrice:
 *                 type: number
 *                 description: Sotuv narxi (so'm)
 *               source:
 *                 type: string
 *                 description: Kirim manbasi (ishchnik postupleniya)
 *               addedBy:
 *                 type: string
 *                 description: Kim qo‘shgan (ixtiyoriy)
 *             required:
 *               - product
 *               - quantity
 *               - costPrice
 *               - salePrice
 *               - source
 *     responses:
 *       201:
 *         description: Kirim muvaffaqiyatli qo‘shildi
 *       500:
 *         description: Server xatosi
 */
router.post('/add', addStock);

/**
 * @swagger
 * /api/stock/all:
 *   get:
 *     tags:
 *       - StockMovement
 *     summary: Barcha kirimlarni olish
 *     description: Barcha mavjud StockMovement yozuvlarini qaytaradi.
 *     responses:
 *       200:
 *         description: Kirimlar muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   product:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   quantity:
 *                     type: number
 *                   costPrice:
 *                     type: number
 *                   salePrice:
 *                     type: number
 *                   source:
 *                     type: string
 *                   addedBy:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server xatosi
 */
router.get('/all', getAllStocks);

module.exports = router;
