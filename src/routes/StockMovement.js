// src/routes/StockMovement.js
const express = require('express');
const router = express.Router();
const { addStock, addSimpleStock, getAllStocks } = require('../controllers/addStock');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: StockMovement
 *     description: Mahsulot kirimlarini boshqarish (приход)
 */

/**
 * @swagger
 * /api/addStock/add:
 *   post:
 *     tags:
 *       - StockMovement
 *     summary: Mahsulot kirimi qo'shish
 *     security:
 *       - bearerAuth: []
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
 *                 description: Kirgan mahsulot miqdori
 *               costPrice:
 *                 type: number
 *                 description: Xarajat narxi (so'm)
 *               salePrice:
 *                 type: number
 *                 description: Sotuv narxi (so'm)
 *               source:
 *                 type: string
 *                 description: Mahsulot kelgan manba
 *               createdBy:
 *                 type: string
 *                 description: Kim tomonidan qo'shilgan (ixtiyoriy)
 *             required:
 *               - product
 *               - quantity
 *               - costPrice
 *               - salePrice
 *               - source
 *     responses:
 *       201:
 *         description: Kirim muvaffaqiyatli qo'shildi
 *       400:
 *         description: Noto'g'ri ma'lumotlar
 *       404:
 *         description: Mahsulot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.post('/add', protect, addStock);

/**
 * @swagger
 * /api/addStock/simple/{productId}:
 *   post:
 *     tags:
 *       - StockMovement
 *     summary: Oddiy stock qo'shish (faqat quantity)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Mahsulot IDsi
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Qo'shiladigan miqdor
 *               notes:
 *                 type: string
 *                 description: Qo'shimcha izoh
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Stock muvaffaqiyatli qo'shildi
 *       400:
 *         description: Noto'g'ri ma'lumotlar
 *       404:
 *         description: Mahsulot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.post('/simple/:productId', protect, addSimpleStock);

/**
 * @swagger
 * /api/addStock/all:
 *   get:
 *     tags:
 *       - StockMovement
 *     summary: Barcha kirimlarni olish
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Barcha stock movement'lar ro'yxati
 *       500:
 *         description: Server xatosi
 */
router.get('/all', protect, getAllStocks);

module.exports = router;