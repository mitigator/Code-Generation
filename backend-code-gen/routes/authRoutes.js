const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate 
} = require('../validations/authValidation');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validateProfileUpdate, updateUserProfile);

module.exports = router;