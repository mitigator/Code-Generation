import express from 'express';
import { combineJsonFiles } from '../controllers/codeGenerationController.js';
import { generateCode, checkCodeGenOutput, getCodeGenOutput,sendForRefinement,
  checkRefinementInput,
  getRefinementInput,
  clearRefinementInput } from '../controllers/codeGenerationController.js';


const router = express.Router();

// Route to combine JSON files
router.get('/combine-json', async (req, res) => {
  try {
    const result = await combineJsonFiles();
      
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        outputPath: result.outputPath,
        data: result.data  // Include the combined data in the response
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in combine-json route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.post('/code-generation/generate', generateCode);

// Add to codeGenerationRoutes.js

router.get('/code-generation/check', checkCodeGenOutput);
router.get('/code-generation/get-data', getCodeGenOutput);

router.post('/code-generation/send-for-refinement', sendForRefinement);
router.get('/code-generation/check-refinement', checkRefinementInput);
router.get('/code-generation/get-refinement-data', getRefinementInput);
router.delete('/code-generation/clear-refinement', clearRefinementInput);



export default router;