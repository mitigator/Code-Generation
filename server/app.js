import express from 'express';
import cors from 'cors';
import descriptionRoutes from './routes/descriptionRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import scaffoldingRoutes from './routes/scaffoldingRoutes.js';
import codeGenerationRoutes from './routes/codeGenerationRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', descriptionRoutes);
app.use('/api', entityRoutes);
app.use('/api', projectRoutes);
app.use('/api', scaffoldingRoutes);
app.use('/api',codeGenerationRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

export default app;