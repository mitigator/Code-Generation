// backend-code-gen/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Create projects directory if it doesn't exist
const projectsDir = path.join(__dirname, process.env.PROJECT_STORAGE_PATH || './generated_projects');
fs.ensureDirSync(projectsDir);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow your Vite frontend
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder for downloads
app.use('/downloads', express.static(path.join(__dirname, 'generated_projects')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/codegen', require('./routes/codeGenRoutes'));
app.use('/api/flowise', require('./routes/flowiseRoutes'));

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app; // For testing purposes