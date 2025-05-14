const fs = require('fs');
const path = require('path');

const saveProject = async (req, res) => {
  try {
    const { projectData } = req.body;
    
    // Ensure the data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save the project data
    const filePath = path.join(dataDir, 'tech_stack.json');
    fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2));
    
    res.status(200).json({ 
      success: true,
      message: 'Project configuration saved successfully',
      filePath
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save project configuration',
      error: error.message
    });
  }
};

module.exports = {
  saveProject
};