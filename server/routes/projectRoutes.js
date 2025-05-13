const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/save', projectController.saveProject);
router.get('/', projectController.getProject);

module.exports = router;