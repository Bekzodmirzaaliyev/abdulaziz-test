const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management
 */

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *                 example: SALE2025
 *               type:
 *                 type: string
 *                 enum: [percent, fixed]
 *                 example: percent
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 10
 *               usageLimit:
 *                 type: integer
 *                 minimum: 0
 *                 example: 5
 *               usedCount:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.png
 *               validDays:
 *                 type: integer
 *                 minimum: 1
 *                 example: 7
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', couponController.createCoupon);
/**
 * @swagger
 * /api/coupons/apply:
 *   post:
 *     summary: Apply a coupon to a shopping cart
 *     tags:
 *       - Coupons
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - cartItems
 *             properties:
 *               code:
 *                 type: string
 *                 description: Kupon kodi (masalan, SUMMER10)
 *               cartItems:
 *                 type: array
 *                 description: Savatchadagi mahsulotlar
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Mahsulot ID (MongoDB ObjectId)
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Mahsulot soni
 *     responses:
 *       200:
 *         description: Kupon muvaffaqiyatli qo‘llandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderTotal:
 *                   type: number
 *                 discountType:
 *                   type: string
 *                   enum: [percent, fixed]
 *                 discountAmount:
 *                   type: number
 *                 finalAmount:
 *                   type: number
 *       400:
 *         description: Yaroqsiz kupon yoki noto‘g‘ri ma’lumot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post('/apply', protect, couponController.applyCoupon);
/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get('/', couponController.getAllCoupons);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete a coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted
 *       404:
 *         description: Coupon not found
 */
router.delete('/:id', couponController.deleteCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Update an existing coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER2025
 *               type:
 *                 type: string
 *                 enum: [percent, fixed]
 *                 example: fixed
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 15
 *               usageLimit:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *               usedCount:
 *                 type: integer
 *                 minimum: 0
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/banner.jpg
 *               validDays:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Validation error or update failure
 *       404:
 *         description: Coupon not found
 */
router.put('/:id', protect, admin, couponController.updateCoupon);

module.exports = router;
