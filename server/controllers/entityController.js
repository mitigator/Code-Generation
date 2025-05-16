import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import { getFilePath, saveFile, readFile } from '../utils/fileUtils.js';
import dotenv from 'dotenv';
dotenv.config();

export async function generateEntities(req, res) {
  try {
    const formData = new FormData();
    
    const filePath = getFilePath('description_generation.json');
    
    formData.append('files', fs.createReadStream(filePath));
    
    const response = await fetch(
      process.env.ENTITY_GENERATION,
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
  const cleanText = result.text.replace(/```json|```/g, '').trim(); // remove code block markers
  entityData = JSON.parse(cleanText);
} catch (parseError) {
  console.error('Error parsing entity generation result:', parseError);
  return res.status(500).json({ error: 'Failed to parse entity generation result' });
}

    
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

export async function getEntityData(req, res) {
  try {
    const entityData = await readFile('entity_generation.json');
    res.json(entityData);
  } catch (error) {
    console.error('Error fetching entity data:', error);
    res.status(404).json({ error: 'Entity data not found' });
  }
}

export async function saveSelectedEntities(req, res) {
  try {
    const { project_name, project_description, entities } = req.body;
    
    const finalData = {
      project_name,
      project_description,
      entities,
      stack: {}, 
      additional_config: {} 
    };

    await saveFile('final_entities.json', finalData);
    
    res.json({
      success: true,
      message: 'Selected entities saved successfully'
    });
  } catch (error) {
    console.error('Error saving selected entities:', error);
    res.status(500).json({ error: 'Failed to save selected entities' });
  }
}

export async function finalizeProject(req, res) {
  try {
    const finalData = await readFile('final_entities.json');
    
    finalData.stack = req.body.stack;
    finalData.additional_config = req.body.additional_config;
    
    await saveFile('final_entities.json', finalData);
    
    res.json({
      success: true,
      message: 'Project finalized successfully',
      data: finalData
    });
  } catch (error) {
    console.error('Error finalizing project:', error);
    res.status(500).json({ error: 'Failed to finalize project' });
  }
}