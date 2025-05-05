// server/controllers/projectController.js
import Project from '../Models/Project.js';
import { queryFlowiseApi } from '../utils/flowiseApi.js';

export const createProject = async (req, res) => {
  try {
    const { project_name } = req.body;
    
    // Check if project exists
    let project = await Project.findOne({ name: project_name });
    
    if (project) {
      return res.status(400).json({ error: 'Project with this name already exists' });
    }
    
    // Generate project description using Flowise
    const flowiseInput = {
      project_name
    };
    
    const flowiseResponse = await queryFlowiseApi(flowiseInput);
    
    // Create new project
    project = new Project({
      name: project_name,
      description: flowiseResponse.result || 'No description generated'
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project', details: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
  }
};
export const downloadProjectCode = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.generatedFiles || project.generatedFiles.length === 0) {
      return res.status(400).json({ error: 'No generated files found for this project' });
    }
    
    const zipFilePath = await generateZipFile(project.name, project.generatedFiles);
    
    res.download(zipFilePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Failed to download file' });
      }
      
      // Delete the temporary zip file after download
      try {
        fs.unlinkSync(zipFilePath);
      } catch (err) {
        console.warn('Failed to delete temporary zip file:', err);
      }
    });
  } catch (error) {
    console.error('Error downloading project code:', error);
    res.status(500).json({ error: 'Failed to download project code', details: error.message });
  }
};