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
    origin: ["http://localhost:5173", "https://abdulaziz-test.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
connectDB();
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
