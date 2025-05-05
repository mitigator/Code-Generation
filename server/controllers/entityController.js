import { processEntityGeneration } from '../services/entityGeneration.js';

export const generateEntity = async (req, res) => {
  try {
    const inputData = req.body;
    
    // Validate input
    if (!inputData) {
      return res.status(400).json({ error: 'Input data is required' });
    }
    
    console.log('Received entity generation request with data:', JSON.stringify(inputData, null, 2));
    
    // Process entity generation
    const result = await processEntityGeneration(inputData);
    
    console.log('Entity generation completed successfully');
    
    // Return result
    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating entity:', error);
    res.status(500).json({ error: 'Failed to generate entity', details: error.message });
  }
};