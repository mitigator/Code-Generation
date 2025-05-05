// server/middleware/validator.js
export const validateProjectInput = (req, res, next) => {
    const { project_name } = req.body;
    
    if (!project_name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    next();
  };
  
  export const validateTechStackInput = (req, res, next) => {
    const { frontend, backend, database } = req.body;
    
    if (!frontend || !backend || !database) {
      return res.status(400).json({ error: 'Frontend, backend, and database selections are required' });
    }
    
    next();
  };
  