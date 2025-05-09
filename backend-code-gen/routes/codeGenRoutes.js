const express = require('express');
const router = express.Router();
const {
  generateProjectCode,
  getGenerationStatus
} = require('../controllers/codeGenController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected with JWT authentication
router.post('/projects/:id/generate', protect, generateProjectCode);
router.get('/projects/:id/status', protect, getGenerationStatus);

module.exports = router;