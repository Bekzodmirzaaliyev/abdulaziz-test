// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
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
// const stockReceiptRoutes = require('./routes/StockMovement'); // Replaced StockMovement
const invoiceRoutes = require('./routes/invoiceRoutes'); // <-- qo'shing

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// 🛡 CORS Middleware
// ====================
app.use(
  cors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Handle CORS preflight requests
app.options('*', cors());

// ====================
// 📦 Middleware
// ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================
// 🔌 Connect to MongoDB
// ====================
connectDB();

// ====================
// 📚 Swagger Docs
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

// ====================
// 🚏 Routes
// ====================
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subcategories', subCategoryRoutes);
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
  });
});

// ====================
// 🚀 Start Server
// ====================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api/docs`);
});