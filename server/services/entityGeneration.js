import { queryFlowiseApi } from '../utils/flowiseApi.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processEntityGeneration = async (inputData) => {
  try {
    const response = await queryFlowiseApi(inputData);
    
    // Option 2: If you need to upload a JSON file with FormData
    // Use this approach if you're actually sending a file rather than just JSON data
    /*
    // Create a temporary JSON file if necessary
    const tempFilePath = path.join(__dirname, '../../temp', 'temp-data.json');
    
    // Ensure temp directory exists
    const tempDir = path.dirname(tempFilePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Write the input data to a JSON file
    fs.writeFileSync(tempFilePath, JSON.stringify(inputData, null, 2));
    
    // Create form data with the JSON file
    const formData = new FormData();
    formData.append('files', fs.createReadStream(tempFilePath));
    
    // Call Flowise API with the form data
    const response = await queryFlowiseApiWithFiles([fs.createReadStream(tempFilePath)]);
    
    // Clean up the temporary file
    try {
      fs.unlinkSync(tempFilePath);
    } catch (err) {
      console.warn('Failed to delete temporary file:', err);
    }
    */
    
    // Process the response if needed
    // This is where you would implement any post-processing logic
    
    return response;
  } catch (error) {
    console.error('Error in entity generation service:', error);
    throw new Error(`Entity generation failed: ${error.message}`);
  }
};