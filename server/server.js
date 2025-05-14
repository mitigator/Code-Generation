// server/server.js
import express from 'express';
import cors from 'cors';
import { ensureDataDirExists } from './utils/fileUtils.js';
import descriptionRoutes from './routes/descriptionRoutes.js';
import entityRoutes from './routes/entityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize data directory
ensureDataDirExists();

// Routes
app.use('/api', descriptionRoutes);
app.use('/api', entityRoutes);
app.use('/api', projectRoutes);



// Add a simple route to check if server is running
app.get('/', (req, res) => {
  res.send('Flowise Integration API is running');
});

// Debug route to check all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = handler.route.path;
          const basePath = middleware.regexp.toString()
            .replace('\\^', '')
            .replace('\\/?(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          
          const fullPath = basePath.replace(/\\/g, '').replace(/\(\?:\(\[\^\\\/\]\+\?\)\)/g, ':id');
          routes.push({
            path: fullPath + path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json(routes);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});