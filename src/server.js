const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig.js'); // Swagger configuration

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://abdulaziz-test.onrender.com"], // Разрешенные домены
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Чтобы можно было передавать куки
  })
);

app.use(express.json());
connectDB();

// Swagger UI теперь доступен по /api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Авторизация
app.use('/api/auth', authRoutes);

// Обработчик ошибок CORS (на случай, если сервер блокирует запрос)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
