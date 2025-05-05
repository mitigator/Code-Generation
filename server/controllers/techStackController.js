// server/controllers/techStackController.js
import Project from '../models/Project.js';
import { generateProjectFiles } from '../services/techStackService.js';

export const addTechStack = async (req, res) => {
  try {
    const { projectId, frontend, backend, database, ai } = req.body;
    
    // Find the project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Update project with tech stack
    project.techStack = {
      frontend: Array.isArray(frontend) ? frontend : [frontend],
      backend: Array.isArray(backend) ? backend : [backend],
      database: Array.isArray(database) ? database : [database],
      ai: Array.isArray(ai) ? ai : [ai]
    };
    
    await project.save();
    
    // Generate project files based on tech stack
    const generatedFiles = await generateProjectFiles(project);
    
    // Update project with generated files
    project.generatedFiles = generatedFiles;
    await project.save();
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error adding tech stack:', error);
    res.status(500).json({ error: 'Failed to add tech stack', details: error.message });
  }
};
