import express from 'express';
import { generateDescription, saveProject } from '../controllers/descriptionController.js';

const router = express.Router();

router.post('/description-generation', generateDescription);
router.post('/save-project', saveProject);

export default router;