import express from 'express';
import { 
  saveSelectedEntities, 
  getEntityData, 
  generateEntities,
  finalizeProject 
} from '../controllers/entityController.js';

const router = express.Router();

router.get('/entity-data', getEntityData);
router.post('/generate-entities', generateEntities);
router.post('/save-selected-entities', saveSelectedEntities);
router.post('/finalize-project', finalizeProject);

export default router;