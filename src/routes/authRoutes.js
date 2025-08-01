const express = require('express');
const {
  registerUser,
  loginUser,
  registerSeller,
  getAllUsers,
  registerCustomer,
  updateUserRole
} = require('../controllers/authController.js');
const protect = require("../middleware/protect.js")

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authorization
 *     description: Foydalanuvchi autentifikatsiyasi va ruxsatnomasi
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authorization
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 img:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Foydalanuvchi allaqachon mavjud
 *       500:
 *         description: Server xatosi
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/role:
 *   put:
 *     tags:
 *       - Authorization
 *     summary: Foydalanuvchining rolini yangilash
 *     description: Faqat admin foydalanuvchilar boshqa foydalanuvchilarning rolini yangilay oladi.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Foydalanuvchining ID raqami
 *               newRole:
 *                 type: string
 *                 description: Yangi rol (masalan, 'admin', 'seller', 'customer')
 *             required:
 *               - userId
 *               - newRole
 *     responses:
 *       200:
 *         description: Rol muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       403:
 *         description: Faqat adminlarga ruxsat berilgan
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Server xatosi
 */


router.put("/role", protect, updateUserRole);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authorization
 *     summary: Tizimga Kirish
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 img:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Foydalanuvchi topilmadi yoki noto'g'ri parol
 *       500:
 *         description: Server xatosi
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/seller/register:
 *   post:
 *     tags:
 *       - Authorization
 *     summary: Register a Seller
 *     description: Creates a new seller account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Seller's username
 *               email:
 *                 type: string
 *                 description: Seller's email address
 *               password:
 *                 type: string
 *                 description: Seller's password
 *               phone:
 *                 type: string
 *                 description: Seller's phone
 *             required:
 *               - username
 *               - email
 *               - password
 *               - phone
 *     responses:
 *       201:
 *         description: Seller successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 img:
 *                   type: string
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 isVerifiedSeller:
 *                   type: boolean
 *       400:
 *         description: Seller already exists or invalid input
 *       500:
 *         description: Server error
 */
router.post('/seller/register', registerSeller);
/**
 * @swagger
 * /api/auth/customer/register:
 *   post:
 *     tags:
 *       - Authorization
 *     summary: Register a Customer
 *     description: Creates a new customer account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Customer successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 img:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: customer
 *                 token:
 *                   type: string
 *       400:
 *         description: Customer already exists
 *       500:
 *         description: Server error
 */
router.post('/customer/register', registerCustomer);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     tags:
 *       - Authorization
 *     summary: Get All Users
 *     description: Retrieves a list of all users in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   img:
 *                     type: string
 *                   role:
 *                     type: string
 *                   storeName:
 *                     type: string
 *                     nullable: true
 *                   storeDescription:
 *                     type: string
 *                     nullable: true
 *                   isVerifiedSeller:
 *                     type: boolean
 *       500:
 *         description: Server error
 */
router.get('/users', getAllUsers);

module.exports = router;
