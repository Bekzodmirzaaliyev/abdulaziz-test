// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // faqat login shart
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoiceController');

/**
 * @swagger
 * tags:
 *   - name: Invoices
 *     description: Kirim/Chiqim (Invoice) bilan ishlash
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: Invoice lar ro'yxati
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [incoming, outgoing] }
 *       - in: query
 *         name: createdBy
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: search
 *         schema: { type: string, description: "comingPlace/note bo'yicha qidiruv" }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', protect, getInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     tags: [Invoices]
 *     summary: Bitta invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/:id', protect, getInvoiceById);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     tags: [Invoices]
 *     summary: Yangi invoice yaratish (stokni ham o'zgartiradi)
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, product]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [incoming, outgoing]
 *               comingPlace:
 *                 type: string
 *               note:
 *                 type: string
 *               product:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product, quantity, costPrice, salePrice]
 *                   properties:
 *                     product: { type: string, description: "Product _id" }
 *                     quantity: { type: number, example: 5 }
 *                     costPrice: { type: number, example: 9000 }
 *                     salePrice: { type: number, example: 12000 }
 *                     uom: { type: string, example: "pcs" }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
router.post('/', protect, createInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     tags: [Invoices]
 *     summary: Invoice yangilash (eski stok effektini qaytarib, yangisini qo'llaydi)
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string, enum: [incoming, outgoing] }
 *               comingPlace: { type: string }
 *               note: { type: string }
 *               product:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product: { type: string }
 *                     quantity: { type: number }
 *                     costPrice: { type: number }
 *                     salePrice: { type: number }
 *                     uom: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.put('/:id', protect, updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     tags: [Invoices]
 *     summary: Invoice o'chirish (stokni qaytaradi)
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/:id', protect, deleteInvoice);

module.exports = router;
