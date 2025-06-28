/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory and stock management
 */

const express = require('express');
const router = express.Router();
const { addStock } = require('../controllers/inventorController');

/**
 * @swagger
 * /api/v1/inventory/add-stock/{productId}:
 *   post:
 *     summary: Add stock to a product
 *     tags: [Inventory]
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
 *     responses:
 *       200:
 *         description: Stock added successfully
 *       400:
 *         description: Invalid input or product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/add-stock/:productId', addStock);

module.exports = router;
