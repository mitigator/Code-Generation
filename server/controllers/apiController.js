const fs = require('fs');
const path = require('path');
const { callFlowiseAPI } = require('../utils/flowiseApi');

exports.processDescription = async (req, res) => {
  try {
    const { projectName, projectDescription, action } = req.body;
    
    // Create the JSON data
    const data = {
      project_name: projectName,
      project_description: projectDescription
    };
    
    // Save to a temporary file
    const filePath = path.join(__dirname, '../uploads', `${Date.now()}-description.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    // Call the Flowise API
    const result = await callFlowiseAPI(
      'c78f0c45-93b0-4457-b173-aaec02ad84e8', //Description Generation Refinement
      { file: filePath }
    );
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error processing description:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateEntities = async (req, res) => {
  try {
    const { projectData } = req.body;
    
    // Save to a temporary file
    const filePath = path.join(__dirname, '../uploads', `${Date.now()}-entities.json`);
    fs.writeFileSync(filePath, projectData);
    
    // Call the Flowise API
    const result = await callFlowiseAPI(
      'd93a1ded-dc5d-416f-91d5-f8a16540e95b',
      { file: filePath }
    );
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error generating entities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.refineEntities = async (req, res) => {
  try {
    const { entityData } = req.body;
    
    // Save to a temporary file
    const filePath = path.join(__dirname, '../uploads', `${Date.now()}-refine-entities.json`);
    fs.writeFileSync(filePath, entityData);
    
    // Call the Flowise API for refinement (assuming you have this endpoint)
    const result = await callFlowiseAPI(
      'baf34a50-f8e6-474a-9664-9c57523766c7', // Replace with your actual refinement endpoint ID
      { file: filePath }
    );
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error refining entities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
