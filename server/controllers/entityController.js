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

// New function to save final entities (only selected ones) to entity_generation.json
export async function saveFinalEntities(req, res) {
  try {
    const { project_name, project_description, entities } = req.body;
    
    // Create the final structure with only selected entities
    const finalEntityData = {
      project_name,
      project_description,
      entities: entities.map(entity => ({
        Entity_Name: entity.Entity_Name || entity.entity_name,
        Entity_Description: entity.Entity_Description || entity.entity_description,
        Fields: entity.Fields || entity.fields || []
      }))
    };

    // Save to entity_generation.json (overwrite with only selected entities)
    await saveFile('entity_generation.json', finalEntityData);
    
    // Also save to final_entities.json for backup
    await saveFile('final_entities.json', {
      ...finalEntityData,
      stack: {},
      additional_config: {}
    });
    
    res.json({
      success: true,
      message: 'Final entities saved successfully',
      data: finalEntityData
    });
  } catch (error) {
    console.error('Error saving final entities:', error);
    res.status(500).json({ error: 'Failed to save final entities' });
  }
}

// Function to add custom entity
export async function addCustomEntity(req, res) {
  try {
    const { Entity_Name, Entity_Description, Fields } = req.body;
    
    if (!Entity_Name || !Entity_Description || !Array.isArray(Fields) || Fields.length === 0) {
      return res.status(400).json({ error: 'Invalid entity data. Please provide name, description, and at least one field.' });
    }

    // Filter out empty fields
    const validFields = Fields.filter(field => field && field.trim() !== '');
    
    if (validFields.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one valid field.' });
    }

    let entityData;
    try {
      // Try to read existing data
      entityData = await readFile('entity_generation.json');
    } catch (error) {
      // If file doesn't exist, create new structure
      entityData = {
        project_name: "Custom Project",
        project_description: "Project with custom entities",
        entities: []
      };
    }

    // Create new entity
    const newEntity = {
      Entity_Name: Entity_Name.trim(),
      Entity_Description: Entity_Description.trim(),
      Fields: validFields.map(field => field.trim())
    };

    // Add to entities array
    entityData.entities.push(newEntity);
    
    // Save updated data
    await saveFile('entity_generation.json', entityData);
    
    res.json({
      success: true,
      message: 'Custom entity added successfully',
      data: entityData,
      newEntity: newEntity
    });
  } catch (error) {
    console.error('Error adding custom entity:', error);
    res.status(500).json({ error: 'Failed to add custom entity' });
  }
}

// Function to update/edit entity
export async function updateEntity(req, res) {
  try {
    const { entityIndex, Entity_Name, Entity_Description, Fields } = req.body;
    
    if (entityIndex === undefined || !Entity_Name || !Entity_Description || !Array.isArray(Fields)) {
      return res.status(400).json({ error: 'Invalid update data' });
    }

    const entityData = await readFile('entity_generation.json');
    
    if (!entityData.entities || entityIndex < 0 || entityIndex >= entityData.entities.length) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Filter out empty fields
    const validFields = Fields.filter(field => field && field.trim() !== '');
    
    if (validFields.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one valid field.' });
    }

    // Update entity
    entityData.entities[entityIndex] = {
      Entity_Name: Entity_Name.trim(),
      Entity_Description: Entity_Description.trim(),
      Fields: validFields.map(field => field.trim())
    };
    
    // Save updated data
    await saveFile('entity_generation.json', entityData);
    
    res.json({
      success: true,
      message: 'Entity updated successfully',
      data: entityData
    });
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: 'Failed to update entity' });
  }
}

// Function to delete entity
export async function deleteEntity(req, res) {
  try {
    const { entityIndex } = req.params;
    const index = parseInt(entityIndex);
    
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: 'Invalid entity index' });
    }

    const entityData = await readFile('entity_generation.json');
    
    if (!entityData.entities || index >= entityData.entities.length) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Remove entity
    entityData.entities.splice(index, 1);
    
    // Save updated data
    await saveFile('entity_generation.json', entityData);
    
    res.json({
      success: true,
      message: 'Entity deleted successfully',
      data: entityData
    });
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: 'Failed to delete entity' });
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