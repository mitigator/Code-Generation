const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  // Create project
  const project = await Project.create({
    name,
    description,
    user: req.user._id,
  });

  // Update user's project count
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { projectsCreated: 1 }
  });

  if (project) {
    res.status(201).json(project);
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

/**
 * @desc    Get all projects for authenticated user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(projects);
});

/**
 * @desc    Get project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

/**
 * @desc    Update project details
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    project.name = name || project.name;
    project.description = description || project.description;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    // Delete the project directory if it exists
    if (project.generatedCode.directoryPath) {
      try {
        await fs.remove(project.generatedCode.directoryPath);
      } catch (error) {
        console.error(`Error deleting project directory: ${error.message}`);
      }
    }
    
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

/**
 * @desc    Download project as ZIP
 * @route   GET /api/projects/:id/download
 * @access  Private
 */
const downloadProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.status !== 'completed' || !project.generatedCode.directoryPath) {
    res.status(400);
    throw new Error('Project code generation is not complete');
  }

  const projectDir = project.generatedCode.directoryPath;
  
  // Check if directory exists
  if (!fs.existsSync(projectDir)) {
    res.status(404);
    throw new Error('Project files not found');
  }

  // Create ZIP file
  const zipFileName = `${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.zip`;
  const zipFilePath = path.join(process.env.PROJECT_STORAGE_PATH, zipFileName);
  
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  output.on('close', () => {
    console.log(`Archive created: ${zipFilePath}`);
    
    // Update project with downloadUrl
    project.generatedCode.downloadUrl = `/downloads/${zipFileName}`;
    project.save();
    
    // Send file for download
    res.download(zipFilePath, `${project.name}.zip`, (err) => {
      if (err) {
        console.error(`Error sending zip file: ${err.message}`);
      }
    });
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(projectDir, '/');
  archive.finalize();
});

/**
 * @desc    Get project generation logs
 * @route   GET /api/projects/:id/logs
 * @access  Private
 */
const getProjectLogs = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.json(project.logs);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

/**
 * @desc    Get project structure
 * @route   GET /api/projects/:id/structure
 * @access  Private
 */
const getProjectStructure = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.json({
      entities: project.entities,
      structure: project.generatedStructure
    });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  downloadProject,
  getProjectLogs,
  getProjectStructure
};