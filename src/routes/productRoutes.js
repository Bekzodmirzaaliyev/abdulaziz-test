// routes/productsRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { checkAuth, checkSeller } = require("../middleware/checkSeller");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Управление продуктами
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - seller
 *         - price
 *         - stock
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор продукта
 *         name:
 *           type: string
 *           description: Название продукта
 *           example: "Sample Product"
 *         category:
 *           type: string
 *           description: ID категории
 *           example: "605c72ef153207001f6470d"
 *         seller:
 *           type: string
 *           description: ID продавца (роль seller)
 *           example: "605c72ef153207001f6470e"
 *         price:
 *           type: object
 *           properties:
 *             costPrice:
 *               type: number
 *               description: Себестоимость
 *               example: 100
 *             sellingPrice:
 *               type: number
 *               description: Цена продажи
 *               example: 150
 *             income:
 *               type: number
 *               description: Прибыль (sellingPrice - costPrice)
 *               example: 50
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *           example: 200
 *         rating:
 *           type: number
 *           description: Рейтинг (0-5)
 *           example: 4.5
 *         view:
 *           type: integer
 *           description: Количество просмотров
 *           example: 50
 *         comments:
 *           type: array
 *           description: Комментарии
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               text:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: URL изображений
 *         description:
 *           type: string
 *           description: Описание продукта
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Теги продукта
 *         isActive:
 *           type: boolean
 *           description: Признак активности товара
 *           example: true
 *       example:
 *         name: "Sample Product"
 *         category: "605c72ef153207001f6470d"
 *         seller: "605c72ef153207001f6470e"
 *         price:
 *           costPrice: 100
 *           sellingPrice: 150
 *           income: 50
 *         stock: 200
 *         rating: 4.5
 *         view: 50
 *         comments:
 *           - user: "605c72ef153207001f6470f"
 *             text: "Great product!"
 *             date: "2025-04-26T00:00:00.000Z"
 *         images:
 *           - "http://example.com/image1.jpg"
 *         description: "This is a sample product."
 *         tags:
 *           - "electronics"
 *           - "sale"
 *         isActive: true
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "Sample Product"
 *             category: "605c72ef153207001f6470d"
 *             seller: "605c72ef153207001f6470e"
 *             price:
 *               costPrice: 100
 *               sellingPrice: 150
 *             stock: 200
 *             rating: 4.5
 *             view: 50
 *             comments:
 *               - user: "605c72ef153207001f6470f"
 *                 text: "Great product!"
 *                 date: "2025-04-26T00:00:00.000Z"
 *             images:
 *               - "http://example.com/image1.jpg"
 *             description: "This is a sample product."
 *             tags:
 *               - "electronics"
 *               - "sale"
 *             isActive: true
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *       400:
 *         description: Неверный запрос
 *   get:
 *     summary: Получить список продуктов
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Количество на странице
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *         description: Сортировка
 *     responses:
 *       200:
 *         description: Список продуктов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.post("/products", checkAuth, checkSeller, productController.createProduct);
router.get("/products", productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Продукт не найден
 *   put:
 *     summary: Обновить продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas\Product'
 *           example:
 *             name: "Updated Product"
 *             category: "605c72ef153207001f6470d"
 *             seller: "605c72ef153207001f6470e"
 *             price:
 *               costPrice: 120
 *               sellingPrice: 170
 *             stock: 150
 *             rating: 4.0
 *             view: 120
 *             comments:
 *               - user: "605c72ef153207001f6470f"
 *                 text: "Updated comment"
 *                 date: "2025-04-26T00:00:00.000Z"
 *             images:
 *               - "http://example.com/image2.jpg"
 *             description: "Updated description"
 *             tags:
 *               - "updated"
 *               - "sale"
 *             isActive: false
 *     responses:
 *       200:
 *         description: Продукт обновлён
 *   delete:
 *     summary: Удалить продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт удалён
 */
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", checkAuth, checkSeller, productController.updateProduct);
router.delete("/products/:id", checkAuth, checkSeller, productController.deleteProduct);

module.exports = router;
