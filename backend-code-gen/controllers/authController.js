// backend-code-gen/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  console.log('Register user request received:', req.body);
  
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.error('Missing required fields');
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('User already exists:', email);
    res.status(400);
    throw new Error('User already exists');
  }

  try {
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log('User created successfully:', user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accountType: user.accountType,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400);
    throw new Error(error.message || 'Invalid user data');
  }
});

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  console.log('Login request received:', req.body);
  
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    console.log('Login successful for user:', user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accountType: user.accountType,
      token: generateToken(user._id),
    });
  } else {
    console.log('Login failed for email:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accountType: user.accountType,
      projectsCreated: user.projectsCreated,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      accountType: updatedUser.accountType,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};