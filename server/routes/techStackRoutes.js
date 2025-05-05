// server/routes/techStackRoutes.js
import express from 'express';
import { addTechStack } from '../controllers/techStackController.js';
import { validateTechStackInput } from '../middleware/validator.js';

const router = express.Router();

router.post('/', validateTechStackInput, addTechStack);

export default router;