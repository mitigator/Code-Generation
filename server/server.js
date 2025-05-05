// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import entityRoutes from './routes/entityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import techStackRoutes from './routes/techStackRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/entity', entityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/techstack', techStackRoutes);

app.get('/', (req, res) => {
  res.send('AI Code Generator API is running!');
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});