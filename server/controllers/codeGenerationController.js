import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const combineJsonFiles = async () => {
  try {
    // Read both JSON files
    const finalEntitiesPath = path.join(__dirname, '../data/final_entities.json');
    const scaffoldingPath = path.join(__dirname, '../data/scaffolding.json');
    
    const finalEntities = JSON.parse(fs.readFileSync(finalEntitiesPath, 'utf8'));
    const scaffolding = JSON.parse(fs.readFileSync(scaffoldingPath, 'utf8'));

    // Combine the data
    const combinedData = {
      project_name: finalEntities.project_name,
      project_description: finalEntities.project_description,
      entities: finalEntities.entities,
      stack: finalEntities.stack,
      additional_config: finalEntities.additional_config,
      folders: scaffolding.json.folders,  // Fixed typo from 'folders' to 'folders'
      files: scaffolding.json.files
    };

    // Log the combined data to console
    console.log('Generated Combined Data:');
    console.log(JSON.stringify(combinedData, null, 2));

    // Write the combined data to codeGenInput.json
    const outputPath = path.join(__dirname, '../data/codeGenInput.json');
    fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2));

    return {
      success: true,
      message: 'JSON files combined successfully',
      outputPath: outputPath,
      data: combinedData  // Include the combined data in the return object
    };
  } catch (error) {
    console.error('Error combining JSON files:', error);
    return {
      success: false,
      message: 'Failed to combine JSON files',
      error: error.message
    };
  }
};

export const generateCode = async (req, res) => {
  try {
    // Path to input and output files
    const dataDir = path.join(__dirname, '..', 'data');
    const inputFilePath = path.join(dataDir, 'codeGenInput.json');
    const outputFilePath = path.join(dataDir, 'codeGenOutput.json');

    // Check if input file exists
    if (!fs.existsSync(inputFilePath)) {
      return res.status(404).json({ error: 'codeGenInput.json not found in data folder' });
    }

    // Create form data and append the file
    const form = new FormData();
    form.append('files', fs.createReadStream(inputFilePath), {
      filename: 'codeGenInput.json',
      contentType: 'application/json',
    });

    // Call the Flowise API
    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/39010780-2759-4841-9c64-f5ab307a1eaf",
      {
        method: "POST",
        body: form,
        headers: form.getHeaders()
      }
    );

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Flowise API returned ${response.status}`,
        details: errorText
      });
    }

    // Parse response
    const result = await response.json();

    // Save response to output file
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));

    // Return the response
    res.json({
      success: true,
      message: 'Code generated successfully',
      result,
      outputFile: 'codeGenOutput.json'
    });
  } catch (error) {
    console.error('Error in code generation:', error);
    res.status(500).json({
      error: 'Failed to generate code',
      message: error.message
    });
  }
};

// Add new functions for checking if file exists and getting file data
export const checkCodeGenOutput = async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const outputFilePath = path.join(dataDir, 'codeGenOutput.json');
    
    const exists = fs.existsSync(outputFilePath);
    
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCodeGenOutput = async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const outputFilePath = path.join(dataDir, 'codeGenOutput.json');
    
    if (!fs.existsSync(outputFilePath)) {
      return res.status(404).json({ error: 'codeGenOutput.json not found' });
    }
    
    const data = fs.readFileSync(outputFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

