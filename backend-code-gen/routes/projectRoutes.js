const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  downloadProject,
  getProjectLogs,
  getProjectStructure
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const { 
  validateCreateProject, 
  validateUpdateProject 
} = require('../validations/projectValidation');

// All routes are protected with JWT authentication
router.route('/')
  .get(protect, getProjects)
  .post(protect, validateCreateProject, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, validateUpdateProject, updateProject)
  .delete(protect, deleteProject);

router.get('/:id/download', protect, downloadProject);
router.get('/:id/logs', protect, getProjectLogs);
router.get('/:id/structure', protect, getProjectStructure);

module.exports = router;