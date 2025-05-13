import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import { getFilePath, saveFile, readFile } from '../utils/fileUtils.js';

// Handle entity generation request
export async function generateEntities(req, res) {
  try {
    // Create a form-data object
    const formData = new FormData();
    
    // Read description_generation.json file
    const filePath = getFilePath('description_generation.json');
    
    // Add file to form-data with key 'files'
    formData.append('files', fs.createReadStream(filePath));
    
    // Call Flowise API for entity generation
    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/bb6caff7-e079-43f7-99f7-02e7487e1ba3",
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders()
      }
    );
    
    const result = await response.json();
    
    // Parse the result.text as JSON (it's a string containing JSON)
    let entityData;
    try {
      entityData = JSON.parse(result.text);
    } catch (parseError) {
      console.error('Error parsing entity generation result:', parseError);
      return res.status(500).json({ error: 'Failed to parse entity generation result' });
    }
    
    // Save the parsed entity data to entity_generation.json
    await saveFile('entity_generation.json', entityData);
    
    res.json({
      success: true,
      message: 'Entities generated successfully',
      data: entityData
    });
  } catch (error) {
    console.error('Error generating entities:', error);
    res.status(500).json({ error: 'Failed to generate entities' });
  }
}

// Get generated entity data
export async function getEntityData(req, res) {
  try {
    const entityData = await readFile('entity_generation.json');
    res.json(entityData);
  } catch (error) {
    console.error('Error fetching entity data:', error);
    res.status(404).json({ error: 'Entity data not found' });
  }
}