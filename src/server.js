<<<<<<< HEAD
// src/server.js
=======
// app.js
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
<<<<<<< HEAD
const swaggerDocs = require('./swaggerConfig');

// Import all routes
=======
const swaggerJsdoc = require('swagger-jsdoc');
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Fixed naming consistency
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const shopRoutes = require('./routes/shopRoutes'); // Fixed naming consistency
const shopUploadRoutes = require('./routes/shopUploadRoutes');
const productUploadRoutes = require('./routes/productUploadRoutes');
const couponRoutes = require('./routes/couponRoutes');
<<<<<<< HEAD
const addStock = require('./routes/StockMovement');
const inventoryRoutes = require('./routes/inventorRoutes'); // Yangi qo'shildi
=======
// const stockReceiptRoutes = require('./routes/StockMovement'); // Replaced StockMovement
const invoiceRoutes = require('./routes/invoiceRoutes'); // <-- qo'shing
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// 🛡 CORS Middleware
// ====================
app.use(
  cors({
<<<<<<< HEAD
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://abdulaziz-test.onrender.com', // Production URL qo'shildi
    ],
=======
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

<<<<<<< HEAD
// Preflight requests uchun
=======
// Handle CORS preflight requests
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
app.options('*', cors());

// ====================
// 📦 Middleware
// ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
<<<<<<< HEAD

// ====================
// 🔌 MongoDB connection
=======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================
// 🔌 Connect to MongoDB
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
// ====================
connectDB();

// ====================
// 📚 Swagger Documentation
// ====================
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce Inventory API',
      version: '1.0.0',
      description: 'API for managing inventory, orders, and products in an e-commerce system',
      contact: {
        name: 'Support Team',
        email: 'support@example.com',
      },
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Development server' },
      { url: process.env.API_URL || 'https://api.example.com', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Include all route files with Swagger annotations
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

<<<<<<< HEAD
// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================
// 🚏 API Routes
=======
// ====================
// 🚏 Routes
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
// ====================

// Authentication routes
app.use('/api/auth', authRoutes);

// Core business routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
<<<<<<< HEAD
app.use('/api/shops', shop);
app.use('/api/coupons', couponRoutes);

// Dashboard and analytics
app.use('/api/dashboard', dashboardRoutes);

// File upload routes
app.use('/api/upload', productUploadRoutes);
app.use('/api/shopUploads', shopUploadRoutes);
app.use('/api/shopUpload', shopUploadRoutes);

// Inventory management routes
app.use('/api/addStock', addStock); // StockMovement routes
app.use('/api/inventory', inventoryRoutes); // Inventory routes (yangi qo'shildi)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
=======
app.use('/api/shops', shopRoutes);
app.use('/api/shop-uploads', shopUploadRoutes); // Consolidated and renamed for clarity
app.use('/api/product-uploads', productUploadRoutes); // Renamed for clarity
app.use('/api/coupons', couponRoutes);
// app.use('/api/receipts', stockReceiptRoutes); // Replaced /api/addStock
app.use('/api/invoices', invoiceRoutes); // <-- qo'shing (Swagger ham avtomatik ko'radi)

// ====================
// 🧯 404 Handler
// ====================
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ====================
// 🧯 Global Error Handler
// ====================
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err.stack);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
  });
});

// ====================
<<<<<<< HEAD
// 🧯 Error Handlers
// ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// ====================
// 🚀 Server startup
// ====================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
=======
// 🚀 Start Server
// ====================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api/docs`);
>>>>>>> 172fdb37179913fbbd7661e0a0373f339e22d92e
});