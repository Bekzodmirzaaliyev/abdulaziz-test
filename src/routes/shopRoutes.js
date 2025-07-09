/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Do'konlar bilan ishlash (seller/admin)
 */

const express = require('express');
const router = express.Router();
const {
  createShop,
  getAllShops,
  getShopById,
  editShop,
  deleteShop,
  banShop,
  getMyShops,
  getShopWithProducts,
  updateShopBanner
} = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadImage');
/**
 * @swagger
 * /api/shops:
 *   post:
 *     summary: Create a new shop (Seller only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shopname
 *               - TariffPlan
 *             properties:
 *               shopname:
 *                 type: string
 *               description:
 *                 type: string
 *               logotype:
 *                 type: string
 *               banner:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lon:
 *                     type: number
 *               TariffPlan:
 *                 type: string
 *                 enum: [basic, standard, premium]
 *     responses:
 *       201:
 *         description: Shop created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Shop already exists
 */
router.post(
  '/',
  protect,
  (req, res, next) => {
    if (req.user.role !== 'seller')
      return res.status(403).json({ message: 'Only sellers can create shops' });
    next();
  },
  upload.single('banner'),
  createShop
);


/**
 * @swagger
 * /api/shops/{id}/banner:
 *   put:
 *     summary: Update shop banner (URL orqali)
 *     tags: [Shops]
 *     description: Rasm yuklangach olingan banner URL ni shopga yozib qo‘yadi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - banner
 *             properties:
 *               banner:
 *                 type: string
 *                 example: /uploads/banner/1720448576193-banner.jpg
 *     responses:
 *       201:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Banner updated successfully
 *       400:
 *         description: Banner is required
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router.put('/:id/banner', protect, updateShopBanner);



/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get all shops (Public)
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: List of shops
 */
router.get('/', getAllShops);
/**
 * @swagger
 * tags:
 *   - name: Shops
 *     description: Seller'ga tegishli do'konlar bilan ishlash
 */

/**
 * @swagger
 * /api/shops/myshops:
 *   get:
 *     summary: Foydalanuvchining do'konlarini olish (faqat seller)
 *     tags: [Shops]
 *     description: Avtorizatsiyadan o'tgan seller o'ziga tegishli do'konlar ro'yxatini oladi.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Do'konlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "665fcf9d5c47b5ae1d2b6b91"
 *                   shopname:
 *                     type: string
 *                     example: "My Electronics Store"
 *                   owner:
 *                     type: string
 *                     example: "665fbd8e12345abc67890fff"
 *                   description:
 *                     type: string
 *                   address:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lon:
 *                         type: number
 *                   TariffPlan:
 *                     type: string
 *       401:
 *         description: Foydalanuvchi avtorizatsiyadan o'tmagan
 *       500:
 *         description: Server xatosi
 */
router.get('/myshops', protect, getMyShops);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get single shop by ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop details
 *       404:
 *         description: Shop not found
 */
router.get('/:id', getShopById);

/**
 * @swagger
 * /api/shops/{id}/full:
 *   get:
 *     summary: Get full shop info with its products
 *     tags: [Shops]
 *     description: Do'kon IDsi orqali uning to'liq ma'lumotlari va unga tegishli mahsulotlar ro'yxatini qaytaradi.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Shop ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop va mahsulotlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shop:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     shopname:
 *                       type: string
 *                     description:
 *                       type: string
 *                     logotype:
 *                       type: string
 *                     address:
 *                       type: string
 *                     location:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lon:
 *                           type: number
 *                     TariffPlan:
 *                       type: string
 *                     owner:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       seller:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                       price:
 *                         type: object
 *                         properties:
 *                           costPrice:
 *                             type: number
 *                           sellingPrice:
 *                             type: number
 *                           income:
 *                             type: number
 *                       stock:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Invalid shop ID
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */

router.get('/:id/full', getShopWithProducts);


/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     summary: Edit shop (owner or admin)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shopname:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               TariffPlan:
 *                 type: string
 *                 enum: [basic, standard, premium]
 *     responses:
 *       200:
 *         description: Shop updated
 *       403:
 *         description: Access denied
 */
router.put('/:id', protect, editShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     summary: Delete a shop (owner or admin)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop deleted
 *       403:
 *         description: Access denied
 */
router.delete('/:id', protect, deleteShop);

/**
 * @swagger
 * /api/shops/ban/{id}:
 *   put:
 *     summary: Ban a shop (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - reason
 *             properties:
 *               from:
 *                 type: string
 *                 format: date-time
 *               to:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shop banned
 *       404:
 *         description: Shop not found
 */
router.put('/ban/:id', protect, admin, banShop);

module.exports = router;
