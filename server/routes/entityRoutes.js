import express from 'express';
import { generateEntities, getEntityData } from '../controllers/entityController.js';

const router = express.Router();

router.post('/generate-entities', generateEntities);
router.get('/entity-data', getEntityData);

export default router;