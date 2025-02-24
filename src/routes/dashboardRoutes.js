const express = require('express');
const { getOrdersAnalysis } = require('../controllers/dashboardController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboardlar ro'yhati 
 */

/**
 * @swagger
 * /api/dashboard/orders-analysis:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Buyurtmalar tahlili
 *     description: "Sana intervali bo'yicha buyurtmalar, bekor qilinganlar, yetkazilganlar va daromad hisobini qaytaradi. (FAQAT CEO uchun)"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Filtrlash boshlanish sanasi (masalan: 2024-01-01)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Filtrlash tugash sanasi (masalan: 2024-12-31)"
 *     responses:
 *       200:
 *         description: "Buyurtmalar tahlili natijalari"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: number
 *                     description: "Oy raqami (1-12)"
 *                   totalOrders:
 *                     type: number
 *                   canceledOrders:
 *                     type: number
 *                   deliveredOrders:
 *                     type: number
 *                   revenue:
 *                     type: number
 *       401:
 *         description: "Foydalanuvchi autentifikatsiyadan o'tmagan"
 *       403:
 *         description: "Admin huquqi talab etiladi"
 */
router.get('/orders-analysis', protect, admin, getOrdersAnalysis);

module.exports = router;
