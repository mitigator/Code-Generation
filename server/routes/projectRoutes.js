import express from 'express';
import { saveProject } from '../controllers/projectController.js';

const router = express.Router();

router.post('/save-project', saveProject);

export default router;