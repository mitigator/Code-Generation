import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const saveProject = async (req, res) => {
  try {
    const { projectData } = req.body;
    
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
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
