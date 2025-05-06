import express from 'express';
import { generateEntity } from '../controllers/entityController.js';

const router = express.Router();

router.post('/generate', generateEntity);

export default router;