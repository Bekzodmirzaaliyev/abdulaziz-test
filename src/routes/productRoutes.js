const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStockSummary,
  getLowStockProducts,
  predictOutOfStock,
  getAllProductsRaw,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadImage');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yangi mahsulot yaratish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - seller
 *               - stock
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               seller:
 *                 type: string
 *               stock:
 *                 type: integer
 *               shop:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *                 example: '{"costPrice": 10000, "sellingPrice": 15000}'
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["summer", "discount"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli yaratildi
 *       400:
 *         description: Xatolik yuz berdi
 */
router.post('/', (req, res, next) => {
  req.destination = 'products';
  next();
}, upload.array('images'), createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Barcha productlarni olish (paramsiz)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Barcha productlar ro'yxati
 *       500:
 *         description: Server xatosi
 */
router.get('/all', getAllProductsRaw);

/**
 * @swagger
 * /api/products/{id}/stock-summary:
 *   get:
 *     summary: Mahsulotning inventar balansini olish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mahsulotning mavjud zaxirasi
 */
router.get('/:id/stock-summary', protect, getProductStockSummary);

/**
 * @swagger
 * /api/products/{id}/predict:
 *   get:
 *     summary: Mahsulot zaxirasining tugashini prognoz qilish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tugash kuni va qayta buyurtma kuni
 */
router.get('/:id/predict', protect, predictOutOfStock);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID orqali mahsulotni olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mahsulot topildi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mahsulotni yangilash
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: object
 *                 properties:
 *                   costPrice:
 *                     type: number
 *                   sellingPrice:
 *                     type: number
 *     responses:
 *       200:
 *         description: Mahsulot yangilandi
 */
router.put('/:id', protect, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Mahsulotni o'chirish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mahsulot o'chirildi
 */
router.delete('/:id', protect, deleteProduct);

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Zaxirasi kam bo'lgan mahsulotlar
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock mahsulotlar ro'yxati
 */
router.get('/low-stock', protect, getLowStockProducts);

module.exports = router;
