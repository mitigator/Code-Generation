import express from 'express';
import { generateScaffolding, getScaffolding } from '../controllers/scaffoldingController.js';

const router = express.Router();

router.post('/generate-scaffolding', generateScaffolding);
router.get('/scaffolding-data', getScaffolding);

export default router;