const express = require('express');
const { createOrder, updateOrder, deleteOrders, getAllOrders } = require('../controllers/orderController.js');
const { protect, admin, customer } = require('../middleware/authMiddleware.js');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Barcha buyurtmalarni ko'rish
 *     description: CEO uchun barcha buyurtmalar ro'yxatini qaytaradi.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar ro'yxati
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan
 *       403:
 *         description: Admin huquqi talab etiladi
 */
router.get('/', protect, admin, getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Yangi buyurtma yaratish
 *     description: Mijoz o'z buyurtmasini yaratadi.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 description: Buyurtma mahsulotlari ro'yxati.
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Mahsulot ID si
 *                     name:
 *                       type: string
 *                       description: Mahsulot nomi
 *                     quantity:
 *                       type: integer
 *                       description: Miqdori
 *                     price:
 *                       type: number
 *                       description: Narxi
 *               total:
 *                 type: number
 *                 description: Buyurtmaning umumiy summasi
 *               paymentMethod:
 *                 type: string
 *                 description: To'lov usuli
 *               deliveryDetails:
 *                 type: object
 *                 description: Yetkazib berish ma'lumotlari
 *                 properties:
 *                   address:
 *                     type: string
 *                   contactNumber:
 *                     type: string
 *                   instructions:
 *                     type: string
 *     responses:
 *       201:
 *         description: Buyurtma muvaffaqiyatli yaratildi
 *       400:
 *         description: Buyurtma ma'lumotlari noto'g'ri
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan
 *       403:
 *         description: Mijoz huquqi talab etiladi
 */
router.post('/', protect, customer, createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Buyurtmani yangilash
 *     description: CEO buyurtmaning ma'lumotlarini yangilaydi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Yangilanishi kerak bo'lgan buyurtma ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 description: Yangilangan mahsulotlar ro'yxati
 *               total:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Preparing, Delivered, Canceled]
 *               paymentMethod:
 *                 type: string
 *               deliveryDetails:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   contactNumber:
 *                     type: string
 *                   instructions:
 *                     type: string
 *     responses:
 *       200:
 *         description: Buyurtma muvaffaqiyatli yangilandi
 *       400:
 *         description: Buyurtma ma'lumotlari noto'g'ri
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan
 *       403:
 *         description: Admin huquqi talab etiladi
 *       404:
 *         description: Buyurtma topilmadi
 */
router.put('/:id', protect, admin, updateOrder);

/**
 * @swagger
 * /api/orders:
 *   delete:
 *     summary: Buyurtmalarni o'chirish
 *     description: CEO bir nechta buyurtmalarni o'chiradi. ID lar array shaklida yuboriladi.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: O'chirilishi kerak bo'lgan buyurtmalar ID lar ro'yxati
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: Buyurtmalar muvaffaqiyatli o'chirildi
 *       400:
 *         description: ID lar noto'g'ri berilgan
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan
 *       403:
 *         description: Admin huquqi talab etiladi
 */
router.delete('/', protect, admin, deleteOrders);

module.exports = router;
