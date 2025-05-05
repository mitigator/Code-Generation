// server/routes/projectRoutes.js
import express from 'express';
import { createProject, getProject, getAllProjects } from '../controllers/projectController.js';
import { validateProjectInput } from '../middleware/validator.js';

const router = express.Router();

router.post('/', validateProjectInput, createProject);
router.get('/:id', getProject);
router.get('/', getAllProjects);
router.get('/:id/download', downloadProjectCode);

export default router;