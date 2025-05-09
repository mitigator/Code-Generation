// routes/flowiseRoutes.js
const express = require('express');
const router = express.Router();
const {
  generateDescription,
  generateEntities
} = require('../controllers/flowiseController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected with JWT authentication
router.post('/generate-description', protect, generateDescription);
router.post('/generate-entities', protect, generateEntities);
router.post('/test-flow', async (req, res) => {
  try {
    const { flowId } = req.body;
    const testPayload = {
      question: "Hey, how are you?"
    };
    
    const response = await flowiseClient.runFlow(flowId, testPayload);
    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Test flow error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
module.exports = router;

// // backend-code-gen/routes/flowiseRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middlewares/authMiddleware');
// const axios = require('axios');

// // Import flowiseController
// const { 
//   generateDescription, 
//   generateEntities,
//   testFlowiseFormats
// } = require('../controllers/flowiseController');

// // Route for generating project description
// router.post('/generate-description', protect, generateDescription);

// // Route for generating project entities
// router.post('/generate-entities', protect, generateEntities);

// // Route for testing different FlowiseAI input formats
// router.post('/test-formats', protect, testFlowiseFormats);

// // Direct test endpoint for FlowiseAI
// router.post('/test-direct', async (req, res) => {
//   try {
//     const { flowId, payload } = req.body;
    
//     if (!flowId) {
//       return res.status(400).json({ success: false, error: 'Flow ID is required' });
//     }
    
//     // Make direct call to FlowiseAI
//     const response = await axios.post(
//       `${process.env.FLOWISE_API_URL}/api/v1/prediction/${flowId}`,
//       payload || { question: "Test question" }
//     );
    
//     res.json({
//       success: true,
//       response: response.data
//     });
//   } catch (error) {
//     console.error('FlowiseAI direct test error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       response: error.response?.data
//     });
//   }
// });

// module.exports = router;