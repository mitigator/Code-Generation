const Joi = require('joi');
const asyncHandler = require('express-async-handler');

/**
 * Validation schema for creating a new project
 */
const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.empty': 'Project name is required',
      'string.min': 'Project name must be at least 3 characters',
      'string.max': 'Project name cannot exceed 100 characters',
      'any.required': 'Project name is required'
    }),
  
  description: Joi.string().trim().min(10).max(1000).required()
    .messages({
      'string.empty': 'Project description is required',
      'string.min': 'Project description must be at least 10 characters',
      'string.max': 'Project description cannot exceed 1000 characters',
      'any.required': 'Project description is required'
    })
});

/**
 * Validation schema for updating a project
 */
const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100)
    .messages({
      'string.min': 'Project name must be at least 3 characters',
      'string.max': 'Project name cannot exceed 100 characters'
    }),
  
  description: Joi.string().trim().min(10).max(1000)
    .messages({
      'string.min': 'Project description must be at least 10 characters',
      'string.max': 'Project description cannot exceed 1000 characters'
    })
});

/**
 * Middleware to validate project creation
 */
const validateCreateProject = asyncHandler(async (req, res, next) => {
  try {
    await createProjectSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
});

/**
 * Middleware to validate project update
 */
const validateUpdateProject = asyncHandler(async (req, res, next) => {
  try {
    await updateProjectSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
});

module.exports = {
  validateCreateProject,
  validateUpdateProject
};