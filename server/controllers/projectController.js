// const { JSON_FILE_PATH } = require('../config/constants');
// const fs = require('fs').promises;
// const path = require('path');

// exports.saveProject = async (req, res) => {
//     try {
//         const { projectName, projectDescription } = req.body;
        
//         const projectData = {
//             projectName,
//             projectDescription,
//             createdAt: new Date().toISOString()
//         };

//         await fs.writeFile(
//             path.resolve(__dirname, '../', JSON_FILE_PATH), 
//             JSON.stringify(projectData, null, 2)
//         );

//         res.json({ 
//             success: true, 
//             message: "Project saved successfully",
//             nextStep: "/entity-generation"
//         });
//     } catch (error) {
//         console.error("Error saving project:", error);
//         res.status(500).json({ error: "Failed to save project" });
//     }
// };

// exports.getProject = async (req, res) => {
//     try {
//         const data = await fs.readFile(path.resolve(__dirname, '../', JSON_FILE_PATH), 'utf8');
//         res.json(JSON.parse(data));
//     } catch (error) {
//         if (error.code === 'ENOENT') {
//             res.status(404).json({ error: "Project not found" });
//         } else {
//             console.error("Error reading project:", error);
//             res.status(500).json({ error: "Failed to read project" });
//         }
//     }
// };


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