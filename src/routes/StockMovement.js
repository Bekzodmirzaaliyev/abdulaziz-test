// routes/stockReceiptRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  deleteReceipt,
  confirmReceipt,
} = require('../controllers/addStock');
const authMiddleware = require('../middleware/auth'); // Adjust path as needed

/**
 * @swagger
 * tags:
 *   - name: StockReceipt
 *     description: Mahsulot kirimlarini boshqarish (приход)
 */

/**
 * @swagger
 * /api/receipts:
 *   post:
 *     tags:
 *       - StockReceipt
 *     summary: Yangi kirim qo'shish
 *     description: Yangi kirim (приход) yozuvini qo‘shadi. Mahsulotlarning `stock` qiymati faqat kirim tasdiqlanganda oshiriladi.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromCompany:
 *                 type: string
 *                 description: Mahsulot kelgan kompaniya nomi
 *                 example: Supplier Inc.
 *               receivedBy:
 *                 type: string
 *                 description: Kirimni qabul qilgan foydalanuvchi IDsi (MongoDB ObjectId)
 *                 example: 60d5f3b7c4b3e12b8c9d1234
 *               items:
 *                 type: array
 *                 description: Kirim qilinayotgan mahsulotlar ro‘yxati
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Mahsulot IDsi (MongoDB ObjectId)
 *                       example: 60d5f3b7c4b3e12b8c9d5678
 *                     quantity:
 *                       type: number
 *                       description: Mahsulot miqdori
 *                       example: 100
 *                     costPrice:
 *                       type: number
 *                       description: Xarajat narxi (so'm)
 *                       example: 10
 *                     sellingPrice:
 *                       type: number
 *                       description: Sotuv narxi (so'm)
 *                       example: 15
 *                 minItems: 1
 *               note:
 *                 type: string
 *                 description: Ixtiyoriy eslatma
 *                 example: Initial stock for new product
 *             required:
 *               - fromCompany
 *               - receivedBy
 *               - items
 *     responses:
 *       201:
 *         description: Kirim muvaffaqiyatli qo‘shildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockReceipt'
 *       400:
 *         description: So‘rovda xato (masalan, noto‘g‘ri ma‘lumotlar)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server xatosi
 */

/**
 * @swagger
 * /api/receipts:
 *   get:
 *     tags:
 *       - StockReceipt
 *     summary: Barcha kirimlarni olish
 *     description: Barcha kirim yozuvlarini foydalanuvchi va mahsulot ma‘lumotlari bilan qaytaradi.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kirimlar muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockReceipt'
 *       500:
 *         description: Server xatosi
 */

/**
 * @swagger
 * /api/receipts/{id}:
 *   get:
 *     tags:
 *       - StockReceipt
 *     summary: Kirimni ID bo‘yicha olish
 *     description: Berilgan IDga ega kirimni foydalanuvchi va mahsulot ma‘lumotlari bilan qaytaradi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kirim IDsi (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Kirim muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockReceipt'
 *       404:
 *         description: Kirim topilmadi
 *       500:
 *         description: Server xatosi
 */

/**
 * @swagger
 * /api/receipts/{id}:
 *   delete:
 *     tags:
 *       - StockReceipt
 *     summary: Kirimni o‘chirish
 *     description: Faqat tasdiqlanmagan kirimni o‘chiradi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kirim IDsi (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Kirim muvaffaqiyatli o‘chirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Receipt deleted
 *       400:
 *         description: Tasdiqlangan kirimni o‘chirish mumkin emas
 *       404:
 *         description: Kirim topilmadi
 *       500:
 *         description: Server xatosi
 */

/**
 * @swagger
 * /api/receipts/{id}/confirm:
 *   patch:
 *     tags:
 *       - StockReceipt
 *     summary: Kirimni tasdiqlash
 *     description: Kirimni tasdiqlaydi, mahsulotlarning `stock` qiymatini oshiradi va StockMovement yozuvlarini yaratadi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kirim IDsi (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Kirim muvaffaqiyatli tasdiqlandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Receipt confirmed
 *                 receipt:
 *                   $ref: '#/components/schemas/StockReceipt'
 *       400:
 *         description: Kirim allaqachon tasdiqlangan yoki xato
 *       404:
 *         description: Kirim topilmadi
 *       500:
 *         description: Server xatosi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StockReceipt:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Kirim IDsi
 *         fromCompany:
 *           type: string
 *           description: Mahsulot kelgan kompaniya
 *         receivedBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *           description: Kirimni qabul qilgan foydalanuvchi
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   sku:
 *                     type: string
 *               quantity:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *           description: Kirim qilinayotgan mahsulotlar
 *         note:
 *           type: string
 *           description: Ixtiyoriy eslatma
 *         status:
 *           type: string
 *           enum: [draft, confirmed]
 *           description: Kirim holati
 *         totalQuantity:
 *           type: number
 *           description: Umumiy mahsulot miqdori
 *         totalAmount:
 *           type: number
 *           description: Umumiy xarajat summasi
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Kirim yaratilgan sana
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Routes
router.post('/', authMiddleware, createReceipt);
router.get('/', authMiddleware, getAllReceipts);
router.get('/:id', authMiddleware, getReceiptById);
router.delete('/:id', authMiddleware, deleteReceipt);
router.patch('/:id/confirm', authMiddleware, confirmReceipt);

module.exports = router;