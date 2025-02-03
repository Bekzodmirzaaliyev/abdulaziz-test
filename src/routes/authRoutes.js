const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish
 *     description: Yangi foydalanuvchi ro'yxatdan o'tkazadi.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Foydalanuvchining ismi
 *               email:
 *                 type: string
 *                 description: Foydalanuvchining elektron pochta manzili
 *               password:
 *                 type: string
 *                 description: Foydalanuvchining paroli
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi
 *       400:
 *         description: Foydalanuvchi allaqachon mavjud
 *       500:
 *         description: Server xatosi
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     description: Foydalanuvchi tizimga kiradi.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Foydalanuvchining elektron pochta manzili
 *               password:
 *                 type: string
 *                 description: Foydalanuvchining paroli
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli tizimga kirdi
 *       400:
 *         description: Foydalanuvchi topilmadi yoki noto'g'ri parol
 *       500:
 *         description: Server xatosi
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Foydalanuvchi profili
 *     description: Hozirgi foydalanuvchining profili
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchining profili
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan
 */
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Admin paneli
 *     description: Admin uchun maxsus panelga kirish.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin paneliga muvaffaqiyatli kirish
 *       403:
 *         description: Admin huquqlari yo'q
 *       401:
 *         description: Foydalanuvchi autentifikatsiyadan o'tmagan
 */
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Admin paneliga xush kelibsiz' });
});

module.exports = router;
