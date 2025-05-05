// server/services/projectService.js
import Project from '../models/Project.js';

export const createNewProject = async (projectData) => {
  try {
    const project = new Project(projectData);
    await project.save();
    return project;
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

export const findProjectById = async (id) => {
  try {
    const project = await Project.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  } catch (error) {
    throw new Error(`Error fetching project: ${error.message}`);
  }
};
