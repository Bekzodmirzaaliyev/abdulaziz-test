const User = require('../models/User.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Foydalanuvchi autentifikatsiyasi uchun operatsiyalar
 */

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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'Foydalanuvchi allaqachon mavjud' });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      img: user.img,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
 *               password:
 *                 type: string
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
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Foydalanuvchi topilmadi' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Noto'g'ri parol" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      img: user.img,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/auth/seller/register:
 *   post:
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               storeName:
 *                 type: string
 *               storeDescription:
 *                 type: string
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
 *                 storeName:
 *                   type: string
 *                 storeDescription:
 *                   type: string
 *                 isVerifiedSeller:
 *                   type: boolean
 *       400:
 *         description: Seller already exists or invalid input
 *       500:
 *         description: Server error
 */
const registerSeller = async (req, res) => {
  const { username, email, password, storeName, storeDescription } = req.body;

  try {
    // Валидация входных данных
    if (!username || !email || !password || !storeName || !storeDescription) {
      return res
        .status(400)
        .json({ message: 'Barcha maydonlar to\'ldirilishi shart' });
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Parol kamida 6 belgi bo\'lishi kerak' });
    }

    // Проверка существования пользователя
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'Sotuvchi allaqachon mavjud' });
    }

    // Проверка уникальности названия магазина
    const storeExists = await User.findOne({ storeName, role: 'seller' });
    if (storeExists) {
      return res
        .status(400)
        .json({ message: 'Bu do\'kon nomi allaqachon ishlatilgan' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'seller',
      storeName,
      storeDescription,
      isVerifiedSeller: false,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      img: user.img,
      role: user.role,
      storeName: user.storeName,
      storeDescription: user.storeDescription,
      isVerifiedSeller: user.isVerifiedSeller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, registerSeller };