import fetch from 'node-fetch';
import { saveFile } from '../utils/fileUtils.js';
import dotenv from 'dotenv';
dotenv.config();



// Handle description generation/refinement request
export async function generateDescription(req, res) {
  try {
    const { project_name, project_description } = req.body;
    
    // Call Flowise API
    const response = await fetch(
      process.env.DESCRIPTION_GENERATION,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "overrideConfig": {
            "promptValues": {
              "project_name": project_name,
              "project_description": project_description
            }
          }
        })
      }
    );
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Error calling Flowise API:', error);
    res.status(500).json({ error: 'Failed to process description generation' });
  }
}

// Handle save project data request
export async function saveProject(req, res) {
  try {
    const projectData = req.body;
    await saveFile('description_generation.json', projectData);
    res.json({ success: true, message: 'Project data saved successfully' });
  } catch (error) {
    console.error('Error saving project data:', error);
    res.status(500).json({ error: 'Failed to save project data' });
  }
}