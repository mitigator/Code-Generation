// import express from 'express';
// import { 
//   generateEntities,
//   getEntityData,
//   saveSelectedEntities,
//   saveFinalEntities,
//   addCustomEntity,
//   updateEntity,
//   deleteEntity,
//   finalizeProject
// } from '../controllers/entityController.js';

// const router = express.Router();

// router.get('/entity-data', getEntityData);
// router.post('/generate-entities', generateEntities);
// router.post('/save-selected-entities', saveSelectedEntities);
// router.post('/finalize-project', finalizeProject);

// router.post('/save-final-entities', saveFinalEntities);
// router.post('/add-custom-entity', addCustomEntity);
// router.put('/update-entity', updateEntity);
// router.delete('/delete-entity/:entityIndex', deleteEntity);

// export default router;
import express from 'express';
import { 
  generateEntities,
  refineEntities,
  getEntityData,
  saveSelectedEntities,
  saveFinalEntities,
  addCustomEntity,
  updateEntity,
  deleteEntity,
  finalizeProject
} from '../controllers/entityController.js';

const router = express.Router();

router.get('/entity-data', getEntityData);
router.post('/generate-entities', generateEntities);
router.post('/refine-entities', refineEntities);
router.post('/save-selected-entities', saveSelectedEntities);
router.post('/finalize-project', finalizeProject);

router.post('/save-final-entities', saveFinalEntities);
router.post('/add-custom-entity', addCustomEntity);
router.put('/update-entity', updateEntity);
router.delete('/delete-entity/:entityIndex', deleteEntity);

export default router;