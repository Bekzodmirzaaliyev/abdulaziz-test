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

app.use(cors());
app.use(express.json());
connectDB();
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI
app.use('/api/auth', authRoutes); // Your authentication routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
