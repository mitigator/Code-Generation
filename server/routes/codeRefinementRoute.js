// Add this to your Express router file
import express from 'express';
import { 
  checkRefinementStatus, 
  combineFiles, 
  getCombinedFile, 
  getSourceFiles, 
  getRefinementData, 
  deleteCombinedFile, 
  clearAllData, 
  mergeRefinedCode,
  refineCode, 
  refineCodeFromUpload 
} from '../controllers/codeRefinementController.js'; // Adjust path as needed

const router = express.Router();

// Status endpoint
router.get('/status', async (req, res) => {
  try {
    const result = await checkRefinementStatus();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Combine files endpoint
router.post('/combine-json', async (req, res) => {
  try {
    const result = await combineFiles();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get combined file endpoint
router.get('/combined', async (req, res) => {
  try {
    const result = await getCombinedFile();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get source files endpoint
router.get('/source-files', async (req, res) => {
  try {
    const result = await getSourceFiles();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get refinement data endpoint
router.get('/refinement-data', async (req, res) => {
  try {
    const result = await getRefinementData();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete combined file endpoint
router.delete('/combined', async (req, res) => {
  try {
    const result = await deleteCombinedFile();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Clear all data endpoint
router.delete('/clear-all', async (req, res) => {
  try {
    const result = await clearAllData();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// MERGE ENDPOINT - This is the key new endpoint
router.post('/merge', async (req, res) => {
  try {
    const result = await mergeRefinedCode();
    if (result.success) {
      res.json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during merge operation',
      error: error.message
    });
  }
});

// Refine code endpoint (using existing input file)
router.post('/refine', refineCode);

// Refine code endpoint (with file upload)
// Note: You'll need to set up multer middleware for file uploads
router.post('/refine-upload', refineCodeFromUpload);

export default router;