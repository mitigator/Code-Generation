// server/utils/fileGenerator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateFileStructure = async (flowiseResponse, techStack) => {
  try {
    // Process Flowise response to extract file structure and code
    // This is a placeholder for the actual implementation that would parse
    // the response from Flowise and convert it to a file structure
    
    // For now, let's assume flowiseResponse.result contains a JSON structure
    // with file paths and content
    const generatedFiles = [];
    
    // Parse the response
    let fileStructure;
    try {
      // If the result is a string, try to parse it as JSON
      if (typeof flowiseResponse.result === 'string') {
        fileStructure = JSON.parse(flowiseResponse.result);
      } else {
        fileStructure = flowiseResponse.result;
      }
    } catch (error) {
      console.error('Error parsing Flowise response:', error);
      throw new Error('Invalid response format from AI service');
    }
    
    // Process each file in the structure
    if (fileStructure && fileStructure.files) {
      fileStructure.files.forEach(file => {
        generatedFiles.push({
          path: file.path,
          content: file.content
        });
      });
    }
    
    return generatedFiles;
  } catch (error) {
    console.error('Error in file generation:', error);
    throw new Error(`File generation failed: ${error.message}`);
  }
};

export const saveFilesToDisk = async (projectName, files) => {
  try {
    const projectDir = path.join(__dirname, '../../generated-projects', projectName);
    
    // Create project directory if it doesn't exist
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    // Save each file
    files.forEach(file => {
      const filePath = path.join(projectDir, file.path);
      
      // Create directories if they don't exist
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      
      // Write file
      fs.writeFileSync(filePath, file.content);
    });
    
    return projectDir;
  } catch (error) {
    console.error('Error saving files to disk:', error);
    throw new Error(`Failed to save files: ${error.message}`);
  }
};