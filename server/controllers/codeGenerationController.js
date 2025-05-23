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
      process.env.CODE_GENERATION,
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

// New function to handle selected files for refinement
export const sendForRefinement = async (req, res) => {
  try {
    const { selected_files } = req.body;

    // Validate input
    if (!selected_files || !Array.isArray(selected_files)) {
      return res.status(400).json({ 
        error: 'Invalid input: selected_files must be an array' 
      });
    }

    // Check if we have files
    if (selected_files.length === 0) {
      return res.status(400).json({ 
        error: 'No files selected for refinement' 
      });
    }

    // Check maximum limit
    if (selected_files.length > 5) {
      return res.status(400).json({ 
        error: 'Maximum 5 files can be selected for refinement' 
      });
    }

    // Validate each file has required properties
    for (const file of selected_files) {
      if (!file.file_path || !file.code) {
        return res.status(400).json({ 
          error: 'Each file must have file_path and code properties' 
        });
      }
    }

    // Prepare refinement data
    const refinementData = {
      timestamp: new Date().toISOString(),
      total_files: selected_files.length,
      selected_files: selected_files.map(file => ({
        file_path: file.file_path,
        code: file.code,
        description: file.description || null,
        language: file.file_path.split('.').pop() || 'unknown'
      }))
    };

    // Save to refinementCodeInput.json
    const dataDir = path.join(__dirname, '..', 'data');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const refinementFilePath = path.join(dataDir, 'refinementCodeInput.json');
    fs.writeFileSync(refinementFilePath, JSON.stringify(refinementData, null, 2));

    console.log(`Refinement data saved with ${selected_files.length} files:`);
    console.log('Files selected for refinement:');
    selected_files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.file_path}`);
    });

    res.json({
      success: true,
      message: 'Files prepared for refinement successfully',
      data: {
        total_files: selected_files.length,
        file_paths: selected_files.map(f => f.file_path),
        saved_to: 'refinementCodeInput.json',
        timestamp: refinementData.timestamp
      }
    });

  } catch (error) {
    console.error('Error in sendForRefinement:', error);
    res.status(500).json({
      error: 'Failed to prepare files for refinement',
      message: error.message
    });
  }
};

// Function to check if refinement input file exists
export const checkRefinementInput = async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const refinementFilePath = path.join(dataDir, 'refinementCodeInput.json');
    
    const exists = fs.existsSync(refinementFilePath);
    
    let data = null;
    if (exists) {
      const fileContent = fs.readFileSync(refinementFilePath, 'utf8');
      const parsedData = JSON.parse(fileContent);
      data = {
        timestamp: parsedData.timestamp,
        total_files: parsedData.total_files,
        file_paths: parsedData.selected_files.map(f => f.file_path)
      };
    }
    
    res.json({ exists, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get refinement input data
export const getRefinementInput = async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const refinementFilePath = path.join(dataDir, 'refinementCodeInput.json');
    
    if (!fs.existsSync(refinementFilePath)) {
      return res.status(404).json({ error: 'refinementCodeInput.json not found' });
    }
    
    const data = fs.readFileSync(refinementFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete refinement input file (optional utility)
export const clearRefinementInput = async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const refinementFilePath = path.join(dataDir, 'refinementCodeInput.json');
    
    if (fs.existsSync(refinementFilePath)) {
      fs.unlinkSync(refinementFilePath);
      res.json({ success: true, message: 'Refinement input cleared successfully' });
    } else {
      res.json({ success: true, message: 'No refinement input file to clear' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};