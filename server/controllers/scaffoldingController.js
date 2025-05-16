import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import { getFilePath, saveFile } from '../utils/fileUtils.js';
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