import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import { getFilePath, saveFile, readFile } from '../utils/fileUtils.js';
import dotenv from 'dotenv';
dotenv.config();

export async function generateScaffolding(req, res) {
  try {
    const filePath = getFilePath('final_entities.json');
    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath));

    const flowiseResponse = await fetch(
      process.env.PROJECT_SCAFFOLDING,
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders()
      }
    );

    const result = await flowiseResponse.json();

    // Save the scaffolding data
    await saveFile('scaffolding.json', result);

    res.json({
      success: true,
      message: 'Project scaffolding generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error generating scaffolding:', error);
    res.status(500).json({ error: 'Failed to generate project scaffolding' });
  }
}

export async function getScaffolding(req, res) {
  try {
    const scaffoldingData = await readFile('scaffolding.json');
    res.json(scaffoldingData);
  } catch (error) {
    console.error('Error fetching scaffolding data:', error);
    res.status(404).json({ error: 'Scaffolding data not found' });
  }
}

// Additional utility function to combine JSON files if needed
export async function combineJson(req, res) {
  try {
    // Read all the relevant JSON files
    const entityData = await readFile('entity_generation.json');
    const scaffoldingData = await readFile('scaffolding.json');
    const finalEntitiesData = await readFile('final_entities.json');

    // Combine the data into a single object
    const combinedData = {
      project_info: {
        name: entityData.project_name || scaffoldingData?.json?.project_name || 'Untitled Project',
        description: entityData.project_description || 'No description available'
      },
      entities: entityData.entities || [],
      tech_stack: finalEntitiesData.stack || {},
      project_structure: {
        folders: scaffoldingData?.json?.folders || '',
        files: scaffoldingData?.json?.files || ''
      },
      timestamp: new Date().toISOString()
    };

    // Save the combined data
    await saveFile('combined_project_data.json', combinedData);

    res.json({
      success: true,
      message: 'JSON files combined successfully',
      data: combinedData
    });
  } catch (error) {
    console.error('Error combining JSON files:', error);
    res.status(500).json({ error: 'Failed to combine JSON files' });
  }
}