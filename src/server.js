// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');

// Import all routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const shop = require('./routes/shopRoutes');
const shopUploadRoutes = require('./routes/shopUploadRoutes');
const productUploadRoutes = require('./routes/productUploadRoutes');
const couponRoutes = require('./routes/couponRoutes');
const addStock = require('./routes/StockMovement');
const inventoryRoutes = require('./routes/inventorRoutes'); // Yangi qo'shildi

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// 🛡 CORS Middleware
// ====================
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://abdulaziz-test.onrender.com', // Production URL qo'shildi
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Preflight requests uchun
app.options('*', cors());

// ====================
// 📦 Middleware
// ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ====================
// 🔌 MongoDB connection
// ====================
connectDB();

// ====================
// 📚 Swagger Documentation
// ====================
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================
// 🚏 API Routes
// ====================

// Authentication routes
app.use('/api/auth', authRoutes);

// Core business routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
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
  });
});

// ====================
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
});