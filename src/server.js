const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "https://abdulaziz-test.onrender.com"],
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
}));

app.use(express.json());
connectDB();

// Swagger UI: /api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Avtorizatsiya API (avvalgi authRoutes)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Yangi Orders API
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Dashboard Analysis API
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/categories', categoryRoutes);

// Global CORS error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
