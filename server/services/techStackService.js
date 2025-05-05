// server/services/techStackService.js
import { queryFlowiseApi } from '../utils/flowiseApi.js';
import { generateFileStructure } from '../utils/fileGenerator.js';

export const generateProjectFiles = async (project) => {
  try {
    // Prepare input for Flowise
    const flowiseInput = {
      project_name: project.name,
      project_description: project.description,
      tech_stack: {
        frontend: project.techStack.frontend,
        backend: project.techStack.backend,
        database: project.techStack.database,
        ai: project.techStack.ai
      }
    };
    
    // Query Flowise API to generate code
    const flowiseResponse = await queryFlowiseApi(flowiseInput);
    
    // Process the response and generate file structure
    const files = await generateFileStructure(flowiseResponse, project.techStack);
    
    return files;
  } catch (error) {
    console.error('Error generating project files:', error);
    throw new Error(`Failed to generate project files: ${error.message}`);
  }
};
