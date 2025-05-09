// backend-code-gen/validations/authValidation.js
const Joi = require('joi');
const asyncHandler = require('express-async-handler');

/**
 * Validation schema for user registration
 */
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string().min(8).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
  
  confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
      'any.only': 'Passwords do not match'
    })
});

/**
 * Validation schema for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

/**
 * Validation schema for profile update
 */
const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string().email()
    .messages({
      'string.email': 'Please enter a valid email'
    }),
  
  password: Joi.string().min(8).allow('')
    .messages({
      'string.min': 'Password must be at least 8 characters'
    }),
  
  confirmPassword: Joi.string().valid(Joi.ref('password'))
    .messages({
      'any.only': 'Passwords do not match'
    })
});

/**
 * Middleware to validate user registration
 */
const validateRegister = asyncHandler(async (req, res, next) => {
  try {
    // Log the request body for debugging
    console.log('Registration request body:', req.body);
    
    const validationResult = await registerSchema.validateAsync(req.body, { abortEarly: false });
    
    // Remove confirmPassword field before passing to the controller
    if (validationResult.confirmPassword) {
      delete req.body.confirmPassword;
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400);
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
});

/**
 * Middleware to validate user login
 */
const validateLogin = asyncHandler(async (req, res, next) => {
  try {
    console.log('Login request body:', req.body);
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.error('Login validation error:', error);
    res.status(400);
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
});

/**
 * Middleware to validate profile update
 */
const validateProfileUpdate = asyncHandler(async (req, res, next) => {
  try {
    await updateProfileSchema.validateAsync(req.body, { abortEarly: false });
    
    // Remove confirmPassword field before passing to the controller
    if (req.body.confirmPassword) {
      delete req.body.confirmPassword;
    }
    
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
});

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate
};