import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to check if file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Helper function to ensure directory exists
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

// Helper function to read JSON file
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${error.message}`);
  }
};

// Helper function to write JSON file
const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Failed to write JSON file: ${error.message}`);
  }
};

// Helper function to extract project files from text content
const extractProjectFilesFromText = (textContent) => {
  try {
    let textToParse = textContent;
    
    // Handle markdown code blocks (```json ... ```)
    if (textToParse.includes('```json')) {
      const jsonMatch = textToParse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        textToParse = jsonMatch[1].trim();
      }
    }
    
    // Handle plain code blocks (``` ... ```)
    if (textToParse.includes('```') && !textToParse.includes('```json')) {
      const codeMatch = textToParse.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch && codeMatch[1]) {
        textToParse = codeMatch[1].trim();
      }
    }
    
    const parsedData = JSON.parse(textToParse);
    
    // Handle different data structures
    if (parsedData.project_files) {
      return parsedData.project_files;
    } else if (Array.isArray(parsedData)) {
      return parsedData;
    } else {
      throw new Error('No project_files array found in the data');
    }
  } catch (err) {
    // If JSON parsing fails, try to extract JSON from the text
    try {
      const jsonStart = textContent.indexOf('{');
      const jsonEnd = textContent.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const extractedJson = textContent.substring(jsonStart, jsonEnd);
        const parsedData = JSON.parse(extractedJson);
        
        if (parsedData.project_files) {
          return parsedData.project_files;
        } else if (Array.isArray(parsedData)) {
          return parsedData;
        }
      }
      
      throw new Error('No valid project files found in the data');
    } catch (secondErr) {
      throw new Error(`Failed to parse project files: ${err.message}`);
    }
  }
};

// Flowise API query function
async function query(formData) {
    const response = await fetch(
        "http://localhost:3000/api/v1/prediction/55b6cd64-4f54-4f71-8e80-d02301e3f2d6",
        {
            method: "POST",
            body: formData
        }
    );
    const result = await response.json();
    return result;
}

/**
 * Check refinement status and get data
 */
export const checkRefinementStatus = async () => {
  try {
    const dataDir = path.join(__dirname, '../data');
    const codeGenerationPath = path.join(dataDir, 'codeGenerationOutput.json');
    const codeGenOutputPath = path.join(dataDir, 'codeGenOutput.json');
    const codeRefinementPath = path.join(dataDir, 'codeRefinementOutput.json');
    const codeRefinementInputPath = path.join(dataDir, 'codeRefinementInput.json');
    const refinementCodeInputPath = path.join(dataDir, 'refinementCodeInput.json');
    const mergedCodeOutputPath = path.join(dataDir, 'mergedCodeOutput.json');

    // Ensure data directory exists
    await ensureDirectoryExists(dataDir);

    const hasCodeGeneration = await fileExists(codeGenerationPath);
    const hasCodeGenOutput = await fileExists(codeGenOutputPath);
    const hasCodeRefinement = await fileExists(codeRefinementPath);
    const hasCodeRefinementInput = await fileExists(codeRefinementInputPath);
    const hasRefinementCodeInput = await fileExists(refinementCodeInputPath);
    const hasMergedCodeOutput = await fileExists(mergedCodeOutputPath);

    let response = {
      success: true,
      hasCodeGeneration,
      hasCodeGenOutput,
      hasCodeRefinement,
      hasCodeRefinementInput,
      hasRefinementCodeInput,
      hasMergedCodeOutput,
      needsRefinement: !hasCodeGeneration && !hasCodeGenOutput,
      canCombine: hasCodeGenOutput && hasRefinementCodeInput,
      canRefine: hasCodeRefinementInput,
      canMerge: hasCodeRefinement && (hasCodeGeneration || hasCodeGenOutput)
    };

    if (hasCodeGeneration) {
      const codeGenerationData = await readJSONFile(codeGenerationPath);
      response.codeGenerationData = codeGenerationData;
    }

    if (hasCodeGenOutput) {
      const codeGenOutputData = await readJSONFile(codeGenOutputPath);
      response.codeGenOutputData = codeGenOutputData;
    }

    if (hasCodeRefinement) {
      const codeRefinementData = await readJSONFile(codeRefinementPath);
      response.codeRefinementData = codeRefinementData;
    }

    if (hasCodeRefinementInput) {
      const codeRefinementInputData = await readJSONFile(codeRefinementInputPath);
      response.codeRefinementInputData = codeRefinementInputData;
    }

    if (hasRefinementCodeInput) {
      const refinementCodeInputData = await readJSONFile(refinementCodeInputPath);
      response.refinementCodeInputData = refinementCodeInputData;
    }

    if (hasMergedCodeOutput) {
      const mergedCodeOutputData = await readJSONFile(mergedCodeOutputPath);
      response.mergedCodeOutputData = mergedCodeOutputData;
    }

    return response;
  } catch (error) {
    console.error('Error checking refinement status:', error);
    return {
      success: false,
      message: 'Failed to check refinement status',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Combines codeGenOutput.json and refinementCodeInput.json into codeRefinementInput.json
 */
export const combineFiles = async () => {
  try {
    const dataFolderPath = path.join(__dirname, '../data');
    
    // Ensure data directory exists
    await ensureDirectoryExists(dataFolderPath);
    
    // Read both JSON files
    const codeGenOutputPath = path.join(dataFolderPath, 'codeGenOutput.json');
    const refinementCodeInputPath = path.join(dataFolderPath, 'refinementCodeInput.json');
    
    // Check if both source files exist
    const hasCodeGenOutput = await fileExists(codeGenOutputPath);
    const hasRefinementCodeInput = await fileExists(refinementCodeInputPath);
    
    if (!hasCodeGenOutput) {
      return {
        success: false,
        message: 'codeGenOutput.json not found',
        error: 'Source file codeGenOutput.json does not exist',
        status: 404
      };
    }
    
    if (!hasRefinementCodeInput) {
      return {
        success: false,
        message: 'refinementCodeInput.json not found',
        error: 'Source file refinementCodeInput.json does not exist',
        status: 404
      };
    }

    const [codeGenOutputData, refinementCodeInputData] = await Promise.all([
      fs.readFile(codeGenOutputPath, 'utf8'),
      fs.readFile(refinementCodeInputPath, 'utf8')
    ]);

    // Parse JSON data
    const codeGenOutput = JSON.parse(codeGenOutputData);
    const refinementCodeInput = JSON.parse(refinementCodeInputData);

    // Combine the data according to the desired structure
    const combinedData = {
      text: codeGenOutput.text || "",
      total_files: refinementCodeInput.total_files || 0,
      selected_files: refinementCodeInput.selected_files || [],
      combinedAt: new Date().toISOString(),
      sourceFiles: {
        codeGenOutput: 'codeGenOutput.json',
        refinementCodeInput: 'refinementCodeInput.json'
      }
    };

    // Write the combined data to codeRefinementInput.json
    const outputPath = path.join(dataFolderPath, 'codeRefinementInput.json');
    await fs.writeFile(outputPath, JSON.stringify(combinedData, null, 2));

    return {
      success: true,
      message: 'Files combined successfully',
      data: combinedData,
      outputPath: 'codeRefinementInput.json'
    };

  } catch (error) {
    console.error('Error combining files:', error);
    
    if (error.name === 'SyntaxError') {
      return {
        success: false,
        message: 'Invalid JSON format in source files',
        error: error.message,
        status: 400
      };
    }

    if (error.code === 'ENOENT') {
      return {
        success: false,
        message: 'One or more input files not found',
        error: error.message,
        status: 404
      };
    }

    return {
      success: false,
      message: 'Internal server error while combining files',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Get the combined file content
 */
export const getCombinedFile = async () => {
  try {
    const dataFolderPath = path.join(__dirname, '../data');
    const filePath = path.join(dataFolderPath, 'codeRefinementInput.json');
    
    const exists = await fileExists(filePath);
    if (!exists) {
      return {
        success: false,
        message: 'Combined file not found. Please combine files first.',
        error: 'codeRefinementInput.json does not exist',
        status: 404
      };
    }
    
    const fileData = await fs.readFile(filePath, 'utf8');
    const parsedData = JSON.parse(fileData);

    return {
      success: true,
      data: parsedData,
      filePath: 'codeRefinementInput.json'
    };

  } catch (error) {
    console.error('Error reading combined file:', error);
    
    if (error.name === 'SyntaxError') {
      return {
        success: false,
        message: 'Invalid JSON format in combined file',
        error: error.message,
        status: 400
      };
    }

    return {
      success: false,
      message: 'Internal server error while reading combined file',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Get individual source files
 */
export const getSourceFiles = async () => {
  try {
    const dataFolderPath = path.join(__dirname, '../data');
    
    const codeGenOutputPath = path.join(dataFolderPath, 'codeGenOutput.json');
    const refinementCodeInputPath = path.join(dataFolderPath, 'refinementCodeInput.json');
    
    const hasCodeGenOutput = await fileExists(codeGenOutputPath);
    const hasRefinementCodeInput = await fileExists(refinementCodeInputPath);
    
    if (!hasCodeGenOutput && !hasRefinementCodeInput) {
      return {
        success: false,
        message: 'No source files found',
        error: 'Neither codeGenOutput.json nor refinementCodeInput.json exist',
        status: 404
      };
    }
    
    const result = {
      success: true,
      data: {},
      availableFiles: []
    };
    
    if (hasCodeGenOutput) {
      const codeGenOutputData = await fs.readFile(codeGenOutputPath, 'utf8');
      const codeGenOutput = JSON.parse(codeGenOutputData);
      result.data.codeGenOutput = codeGenOutput;
      result.availableFiles.push('codeGenOutput.json');
    }
    
    if (hasRefinementCodeInput) {
      const refinementCodeInputData = await fs.readFile(refinementCodeInputPath, 'utf8');
      const refinementCodeInput = JSON.parse(refinementCodeInputData);
      result.data.refinementCodeInput = refinementCodeInput;
      result.availableFiles.push('refinementCodeInput.json');
    }

    return result;

  } catch (error) {
    console.error('Error reading source files:', error);
    
    if (error.name === 'SyntaxError') {
      return {
        success: false,
        message: 'Invalid JSON format in source files',
        error: error.message,
        status: 400
      };
    }

    return {
      success: false,
      message: 'Internal server error while reading source files',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Get refinement data (compatibility endpoint)
 */
export const getRefinementData = async () => {  
  try {
    const dataDir = path.join(__dirname, '../data');
    const codeGenerationPath = path.join(dataDir, 'codeGenerationOutput.json');
    const codeGenOutputPath = path.join(dataDir, 'codeGenOutput.json');

    // Check for codeGenerationOutput.json first (legacy support)
    if (await fileExists(codeGenerationPath)) {
      const codeGenerationData = await readJSONFile(codeGenerationPath);
      return {
        success: true,
        data: codeGenerationData,
        source: 'codeGenerationOutput.json'
      };
    }

    // Check for codeGenOutput.json
    if (await fileExists(codeGenOutputPath)) {
      const codeGenOutputData = await readJSONFile(codeGenOutputPath);
      return {
        success: true,
        data: codeGenOutputData,
        source: 'codeGenOutput.json'
      };
    }

    return {
      success: false,
      message: 'No code generation output found',
      error: 'Neither codeGenerationOutput.json nor codeGenOutput.json found',
      status: 404
    };

  } catch (error) {
    console.error('Error retrieving refinement data:', error);
    return {
      success: false,
      message: 'Failed to retrieve refinement data',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Delete the combined file
 */
export const deleteCombinedFile = async () => {
  try {
    const dataFolderPath = path.join(__dirname, '../data');
    const filePath = path.join(dataFolderPath, 'codeRefinementInput.json');
    
    const exists = await fileExists(filePath);
    if (!exists) {
      return {
        success: false,
        message: 'Combined file not found',
        error: 'codeRefinementInput.json does not exist',
        status: 404
      };
    }
    
    await fs.unlink(filePath);

    return {
      success: true,
      message: 'Combined file deleted successfully',
      deletedFile: 'codeRefinementInput.json'
    };

  } catch (error) {
    console.error('Error deleting combined file:', error);
    
    return {
      success: false,
      message: 'Internal server error while deleting combined file',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Clear all data files
 */
export const clearAllData = async () => {
  try {
    const dataDir = path.join(__dirname, '../data');
    const filesToDelete = [
      'codeGenerationOutput.json',
      'codeGenOutput.json',
      'codeRefinementOutput.json',
      'codeRefinementInput.json',
      'refinementCodeInput.json',
      'mergedCodeOutput.json'
    ];

    const deletionResults = [];

    for (const filename of filesToDelete) {
      const filePath = path.join(dataDir, filename);
      const exists = await fileExists(filePath);
      
      if (exists) {
        try {
          await fs.unlink(filePath);
          deletionResults.push({ file: filename, status: 'deleted' });
        } catch (error) {
          deletionResults.push({ 
            file: filename, 
            status: 'error', 
            error: error.message 
          });
        }
      } else {
        deletionResults.push({ file: filename, status: 'not_found' });
      }
    }

    const deletedCount = deletionResults.filter(r => r.status === 'deleted').length;
    const errorCount = deletionResults.filter(r => r.status === 'error').length;

    return {
      success: true,
      message: `Clear operation completed. Deleted: ${deletedCount}, Errors: ${errorCount}`,
      results: deletionResults,
      summary: {
        deleted: deletedCount,
        errors: errorCount,
        notFound: deletionResults.length - deletedCount - errorCount
      }
    };

  } catch (error) {
    console.error('Error during clear operation:', error);
    return {
      success: false,
      message: 'Clear operation failed',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Merge refined code with original code
 * This replaces files in codeGenOutput with corresponding files from codeRefinementOutput
 * based on matching file_path
 */
export const mergeRefinedCode = async () => {
  try {
    const dataDir = path.join(__dirname, '../data');
    const codeGenOutputPath = path.join(dataDir, 'codeGenOutput.json');
    const codeRefinementOutputPath = path.join(dataDir, 'codeRefinementOutput.json');
    const mergedCodeOutputPath = path.join(dataDir, 'mergedCodeOutput.json');

    // Ensure data directory exists
    await ensureDirectoryExists(dataDir);

    // Check if both source files exist
    const hasCodeGenOutput = await fileExists(codeGenOutputPath);
    const hasCodeRefinementOutput = await fileExists(codeRefinementOutputPath);

    if (!hasCodeGenOutput) {
      return {
        success: false,
        message: 'codeGenOutput.json not found',
        error: 'Source file codeGenOutput.json does not exist',
        status: 404
      };
    }

    if (!hasCodeRefinementOutput) {
      return {
        success: false,
        message: 'codeRefinementOutput.json not found',
        error: 'Source file codeRefinementOutput.json does not exist',
        status: 404
      };
    }

    // Read both files
    const [codeGenOutputData, codeRefinementOutputData] = await Promise.all([
      readJSONFile(codeGenOutputPath),
      readJSONFile(codeRefinementOutputPath)
    ]);

    // Extract project files from codeGenOutput
    let originalFiles = [];
    if (codeGenOutputData.text) {
      originalFiles = extractProjectFilesFromText(codeGenOutputData.text);
    } else if (codeGenOutputData.project_files) {
      originalFiles = codeGenOutputData.project_files;
    } else {
      throw new Error('No project files found in codeGenOutput.json');
    }

    // Extract project files from codeRefinementOutput
    let refinedFiles = [];
    if (codeRefinementOutputData.text) {
      refinedFiles = extractProjectFilesFromText(codeRefinementOutputData.text);
    } else if (Array.isArray(codeRefinementOutputData)) {
      refinedFiles = codeRefinementOutputData;
    } else {
      throw new Error('No project files found in codeRefinementOutput.json');
    }

    // Create a map of refined files by file_path for quick lookup
    const refinedFilesMap = new Map();
    refinedFiles.forEach(file => {
      if (file.file_path) {
        refinedFilesMap.set(file.file_path, file);
      }
    });

    // Merge logic: replace original files with refined versions if they exist
    const mergedFiles = originalFiles.map(originalFile => {
      const refinedFile = refinedFilesMap.get(originalFile.file_path);
      if (refinedFile) {
        // Mark the file as refined and include refinement timestamp
        return {
          ...refinedFile,
          refined: true,
          refinedAt: new Date().toISOString(),
          originalDescription: originalFile.description
        };
      }
      // Keep original file unchanged
      return {
        ...originalFile,
        refined: false
      };
    });

    // Count statistics
    const totalFiles = originalFiles.length;
    const refinedFilesCount = mergedFiles.filter(file => file.refined).length;
    const unchangedFilesCount = totalFiles - refinedFilesCount;

    // Create the merged output structure
    const mergedOutput = {
      text: JSON.stringify({
        project_files: mergedFiles
      }, null, 2),
      mergedAt: new Date().toISOString(),
      sourceFiles: {
        original: 'codeGenOutput.json',
        refined: 'codeRefinementOutput.json'
      },
      summary: {
        totalFiles,
        refinedFiles: refinedFilesCount,
        unchangedFiles: unchangedFilesCount,
        refinementPaths: refinedFiles.map(f => f.file_path)
      }
    };

    // Write the merged output
    await writeJSONFile(mergedCodeOutputPath, mergedOutput);

    return {
      success: true,
      message: `Successfully merged ${refinedFilesCount} refined files with ${unchangedFilesCount} original files`,
      data: mergedOutput,
      outputPath: 'mergedCodeOutput.json',
      summary: {
        totalFiles,
        refinedFiles: refinedFilesCount,
        unchangedFiles: unchangedFilesCount
      }
    };

  } catch (error) {
    console.error('Error merging refined code:', error);

    if (error.name === 'SyntaxError') {
      return {
        success: false,
        message: 'Invalid JSON format in source files',
        error: error.message,
        status: 400
      };
    }

    if (error.code === 'ENOENT') {
      return {
        success: false,
        message: 'One or more input files not found',
        error: error.message,
        status: 404
      };
    }

    return {
      success: false,
      message: 'Internal server error while merging code',
      error: error.message,
      status: 500
    };
  }
};

/**
 * Refine code using existing input file
 */
export const refineCode = async (req, res) => {
    try {
        // Path to the input file
        const inputFilePath = path.join(__dirname, '../data/codeRefinementInput.json');
        const outputFilePath = path.join(__dirname, '../data/codeRefinementOutput.json');

        // Check if input file exists
        const inputExists = await fileExists(inputFilePath);
        if (!inputExists) {
            return res.status(404).json({
                success: false,
                message: 'Input file not found',
                error: 'codeRefinementInput.json does not exist in data folder',
                suggestion: 'Please combine source files first using /combine-json endpoint'
            });
        }

        // Read the input file
        const inputData = await fs.readFile(inputFilePath, 'utf8');
        
        // Validate JSON format
        let parsedInput;
        try {
            parsedInput = JSON.parse(inputData);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON in input file',
                error: error.message
            });
        }
        
        // Create FormData and append the file
        const formData = new FormData();
        const blob = new Blob([inputData], { type: 'application/json' });
        formData.append('files', blob, 'codeRefinementInput.json');

        // Call Flowise API
        console.log('Calling Flowise API for code refinement...');
        const flowiseResponse = await query(formData);

        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        await ensureDirectoryExists(dataDir);

        // Save the response to output file
        await fs.writeFile(
            outputFilePath, 
            JSON.stringify(flowiseResponse, null, 2), 
            'utf8'
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Code refinement completed successfully',
            data: flowiseResponse,
            outputFile: 'codeRefinementOutput.json',
            inputFile: 'codeRefinementInput.json',
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in code refinement:', error);
        
        // Handle different types of errors
        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON in input file',
                error: error.message
            });
        }

        if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
            return res.status(503).json({
                success: false,
                message: 'Unable to connect to Flowise API',
                error: 'Make sure Flowise server is running on localhost:3000',
                flowiseEndpoint: process.env.CODE_REFINEMENT
            });
        }

        if (error.code === 'EACCES') {
            return res.status(403).json({
                success: false,
                message: 'Permission denied accessing files',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during code refinement',
            error: error.message
        });
    }
};

/**
 * Refine code with file upload
 */
export const refineCodeFromUpload = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                error: 'Please upload a JSON file'
            });
        }

        // Validate file type
        if (!req.file.originalname.endsWith('.json') && req.file.mimetype !== 'application/json') {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type',
                error: 'Only JSON files are allowed'
            });
        }

        // Validate file content
        let fileContent;
        try {
            fileContent = req.file.buffer.toString('utf8');
            JSON.parse(fileContent); // Validate JSON format
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON in uploaded file',
                error: error.message
            });
        }

        // Create FormData and append the uploaded file
        const formData = new FormData();
        const fileBuffer = req.file.buffer;
        const blob = new Blob([fileBuffer], { type: 'application/json' });
        formData.append('files', blob, req.file.originalname);

        // Call Flowise API
        console.log('Calling Flowise API for uploaded file refinement...');
        const flowiseResponse = await query(formData);

        // Save the response to output file
        const outputFilePath = path.join(__dirname, '../data/codeRefinementOutput.json');
        
        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        await ensureDirectoryExists(dataDir);

        await fs.writeFile(
            outputFilePath, 
            JSON.stringify(flowiseResponse, null, 2), 
            'utf8'
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Code refinement completed successfully',
            data: flowiseResponse,
            outputFile: 'codeRefinementOutput.json',
            uploadedFile: req.file.originalname,
            fileSize: req.file.size,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in code refinement from upload:', error);
        
        // Handle different types of errors
        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON in uploaded file',
                error: error.message
            });
        }

        if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
            return res.status(503).json({
                success: false,
                message: 'Unable to connect to Flowise API',
                error: 'Make sure Flowise server is running on localhost:3000',
                flowiseEndpoint: 'http://localhost:3000/api/v1/prediction/55b6cd64-4f54-4f71-8e80-d02301e3f2d6'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during code refinement',
            error: error.message
        });
    }
};