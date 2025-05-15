import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import { getFilePath, saveFile } from '../utils/fileUtils.js';

export async function generateScaffolding(req, res) {
  try {
    // Read the final_entities.json file
    const filePath = getFilePath('final_entities.json');
    
    // Create form-data object
    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath));

    // Call Flowise API
    const flowiseResponse = await fetch(
      "http://localhost:3000/api/v1/prediction/342522aa-c0e8-48d3-9f56-ac90a04376ea",
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders()
      }
    );

    const result = await flowiseResponse.json();

    // Save the scaffolding result
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