// src/routes/inventorRoutes.js
const express = require('express');
const router = express.Router();
const { addStock } = require('../controllers/inventorController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory and stock management
 */

/**
 * @swagger
 * /api/inventory/add-stock/{productId}:
 *   post:
 *     summary: Add stock to a specific product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to add stock to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Amount of stock to add
 *                 minimum: 1
 *               notes:
 *                 type: string
 *                 description: Optional notes about the stock addition
 *     responses:
 *       200:
 *         description: Stock added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedStock:
 *                   type: number
 *                 product:
 *                   type: object
 *       400:
 *         description: Invalid input or product ID
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/add-stock/:productId', protect, addStock);

module.exports = router;