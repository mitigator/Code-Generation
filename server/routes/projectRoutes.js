// const express = require('express');
// const router = express.Router();
// const projectController = require('../controllers/projectController');

// router.post('/save', projectController.saveProject);
// router.get('/', projectController.getProject);

// module.exports = router;

// routes/projectRoutes.js
import express from 'express';
import { saveProject } from '../controllers/projectController.js';

const router = express.Router();

router.post('/save-project', saveProject);

export default router;