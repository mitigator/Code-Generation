// backend-code-gen/controllers/codeGenController.js
const asyncHandler = require('express-async-handler');
const fs = require('fs-extra');
const path = require('path');
const Project = require('../models/Project');
const flowiseClient = require('../utils/flowiseClient');

/**
 * @desc    Generate code for a project
 * @route   POST /api/codegen/projects/:id/generate
 * @access  Private
 */
const generateProjectCode = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to generate code for this project');
  }

  // Check if project has entities
  if (!project.acceptedEntities || project.acceptedEntities.length === 0) {
    res.status(400);
    throw new Error('Project must have at least one entity before generating code');
  }

  // Update project status to generating
  project.status = 'generating';
  project.logs.push({
    message: 'Started project code generation',
    level: 'info',
  });
  await project.save();

  // Send initial response to client
  res.status(202).json({
    message: 'Code generation started',
    projectId: project._id,
  });

  // Process in background
  generateCodeInBackground(project);
});

/**
 * Background process to generate code
 * @param {Object} project - The project document
 */
const generateCodeInBackground = async (project) => {
  try {
    // Create project directory
    const projectDir = path.join(
      process.env.PROJECT_STORAGE_PATH || './generated_projects',
      `project_${project._id}_${Date.now()}`
    );
    await fs.ensureDir(projectDir);

    // Update project with directory path
    project.generatedCode.directoryPath = projectDir;
    project.logs.push({
      message: 'Created project directory',
      level: 'info',
    });
    await project.save();

    // Create directory structure
    await createDirectoryStructure(projectDir);
    
    project.logs.push({
      message: 'Created directory structure',
      level: 'info',
    });
    await project.save();

    // Generate files based on entities and templates
    await generateFiles(projectDir, project);

    // Update project status to completed
    project.status = 'completed';
    project.logs.push({
      message: 'Project code generation completed successfully',
      level: 'info',
    });
    await project.save();

  } catch (error) {
    console.error('Code generation error:', error);
    
    // Update project status to failed
    project.status = 'failed';
    project.logs.push({
      message: `Code generation failed: ${error.message}`,
      level: 'error',
    });
    await project.save();
  }
};

/**
 * Create directory structure for the project
 * @param {string} baseDir - Base directory path
 */
const createDirectoryStructure = async (baseDir) => {
  // Create backend directory
  const backendDir = path.join(baseDir, 'backend');
  await fs.ensureDir(backendDir);

  // Create subdirectories for backend
  const backendDirs = [
    'config',
    'controllers',
    'models',
    'routes',
    'middlewares',
    'utils',
    'validations',
    'uploads',
    'tests'
  ];

  for (const dir of backendDirs) {
    await fs.ensureDir(path.join(backendDir, dir));
  }

  // Create frontend directory
  const frontendDir = path.join(baseDir, 'frontend');
  await fs.ensureDir(frontendDir);

  // Create subdirectories for frontend
  const frontendDirs = [
    'public',
    'src/assets',
    'src/components',
    'src/pages',
    'src/features',
    'src/services',
    'src/hooks',
    'src/routes',
    'src/context',
    'src/styles'
  ];

  for (const dir of frontendDirs) {
    await fs.ensureDir(path.join(frontendDir, dir));
  }
};

/**
 * Generate files for the project
 * @param {string} baseDir - Base directory path
 * @param {Object} project - The project document
 */
const generateFiles = async (baseDir, project) => {
  // Generate common files
  await generateCommonFiles(baseDir, project);
  
  // Generate entity-specific files
  await generateEntityFiles(baseDir, project);
};

/**
 * Generate common project files
 * @param {string} baseDir - Base directory path
 * @param {Object} project - The project document
 */
const generateCommonFiles = async (baseDir, project) => {
  // Generate package.json
  const packageJsonContent = `{
  "name": "${project.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "${project.description}",
  "main": "server.js",
  "scripts": {
    "start": "node backend/server.js",
    "server": "nodemon backend/server.js",
    "client": "npm start --prefix frontend",
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "data:import": "node backend/seeder",
    "data:destroy": "node backend/seeder -d"
  },
  "keywords": [],
  "author": "AI Code Generator",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "colors": "^1.4.0",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "concurrently": "^8.0.1",
    "nodemon": "^2.0.22"
  }
}`;

  await fs.writeFile(path.join(baseDir, 'package.json'), packageJsonContent);

  // Generate .env file
  const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/${project.name.toLowerCase().replace(/\s+/g, '_')}
JWT_SECRET=abc123
JWT_EXPIRE=30d`;

  await fs.writeFile(path.join(baseDir, '.env'), envContent);

  // Generate server.js
  const serverJsContent = `const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./backend/config/db');
const { notFound, errorHandler } = require('./backend/middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
${project.acceptedEntities.map(entity => 
  `app.use('/api/${entity.Entity_Name.toLowerCase()}s', require('./backend/routes/${entity.Entity_Name.toLowerCase()}Routes'));`
).join('\n')}

// Set static folder
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
);

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    \`Server running in \${process.env.NODE_ENV} mode on port \${PORT}\`.yellow.bold
  )
);`;

  await fs.writeFile(path.join(baseDir, 'backend/server.js'), serverJsContent);

  // Generate db.js
  const dbJsContent = `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(\`MongoDB Connected: \${conn.connection.host}\`.cyan.underline);
  } catch (error) {
    console.error(\`Error: \${error.message}\`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = { connectDB };`;

  await fs.writeFile(path.join(baseDir, 'backend/config/db.js'), dbJsContent);

  // Generate error middleware
  const errorMiddlewareContent = `const notFound = (req, res, next) => {
  const error = new Error(\`Not Found - \${req.originalUrl}\`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };`;

  await fs.writeFile(path.join(baseDir, 'backend/middlewares/errorMiddleware.js'), errorMiddlewareContent);
};

/**
 * Generate entity-specific files
 * @param {string} baseDir - Base directory path
 * @param {Object} project - The project document
 */
const generateEntityFiles = async (baseDir, project) => {
  // Generate files for each entity
  for (const entity of project.acceptedEntities) {
    // Generate model
    await generateModelFile(baseDir, entity);
    
    // Generate controller
    await generateControllerFile(baseDir, entity);
    
    // Generate routes
    await generateRoutesFile(baseDir, entity);
  }
};

/**
 * Generate model file for an entity
 * @param {string} baseDir - Base directory path
 * @param {Object} entity - The entity
 */
const generateModelFile = async (baseDir, entity) => {
  const modelName = entity.Entity_Name;
  const modelFields = entity.Fields || [];
  
  let fieldsCode = '';
  
  // Generate code for each field
  for (const field of modelFields) {
    if (field === 'id') continue; // Skip id field as MongoDB adds _id
    
    if (field.includes('Id') || field.endsWith('_id')) {
      fieldsCode += `  ${field}: {
    type: mongoose.Schema.Types.ObjectId,
    ref: '${field.replace('Id', '').replace('_id', '')}',
  },\n`;
    } 
    else if (field.includes('date') || field.includes('Date')) {
      fieldsCode += `  ${field}: {
    type: Date,
    default: Date.now,
  },\n`;
    }
    else if (field.includes('image') || field.includes('Image') || field.includes('url') || field.includes('Url')) {
      fieldsCode += `  ${field}: {
    type: String,
    default: '',
  },\n`;
    }
    else if (field.includes('price') || field.includes('Price') || field.includes('amount') || field.includes('Amount') || field.includes('salary') || field.includes('Salary')) {
      fieldsCode += `  ${field}: {
    type: Number,
    default: 0,
  },\n`;
    }
    else if (field.includes('status') || field.includes('Status') || field.includes('type') || field.includes('Type')) {
      fieldsCode += `  ${field}: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },\n`;
    }
    else if (field === 'password') {
      fieldsCode += `  ${field}: {
    type: String,
    required: true,
    minlength: 6,
  },\n`;
    }
    else if (field === 'email') {
      fieldsCode += `  ${field}: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,
      'Please add a valid email',
    ],
  },\n`;
    }
    else if (field === 'role') {
      fieldsCode += `  ${field}: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },\n`;
    }
    else {
      fieldsCode += `  ${field}: {
    type: String,
    required: true,
    trim: true,
  },\n`;
    }
  }
  
  const modelContent = `const mongoose = require('mongoose');

const ${modelName.toLowerCase()}Schema = new mongoose.Schema(
  {
${fieldsCode}  },
  {
    timestamps: true,
  }
);

// Add any methods or middleware here

const ${modelName} = mongoose.model('${modelName}', ${modelName.toLowerCase()}Schema);

module.exports = ${modelName};`;

  await fs.writeFile(
    path.join(baseDir, `backend/models/${modelName}.js`),
    modelContent
  );
};

/**
 * Generate controller file for an entity
 * @param {string} baseDir - Base directory path
 * @param {Object} entity - The entity
 */
const generateControllerFile = async (baseDir, entity) => {
  const entityName = entity.Entity_Name;
  const pluralName = `${entityName.toLowerCase()}s`;
  
  const controllerContent = `const asyncHandler = require('express-async-handler');
const ${entityName} = require('../models/${entityName}');

// @desc    Get all ${pluralName}
// @route   GET /api/${pluralName}
// @access  Public
const get${entityName}s = asyncHandler(async (req, res) => {
  const ${pluralName} = await ${entityName}.find({});
  res.json(${pluralName});
});

// @desc    Get single ${entityName.toLowerCase()}
// @route   GET /api/${pluralName}/:id
// @access  Public
const get${entityName}ById = asyncHandler(async (req, res) => {
  const ${entityName.toLowerCase()} = await ${entityName}.findById(req.params.id);
  
  if (${entityName.toLowerCase()}) {
    res.json(${entityName.toLowerCase()});
  } else {
    res.status(404);
    throw new Error('${entityName} not found');
  }
});

// @desc    Create a ${entityName.toLowerCase()}
// @route   POST /api/${pluralName}
// @access  Private
const create${entityName} = asyncHandler(async (req, res) => {
  const ${entityName.toLowerCase()} = new ${entityName}(req.body);

  const created${entityName} = await ${entityName.toLowerCase()}.save();
  res.status(201).json(created${entityName});
});

// @desc    Update a ${entityName.toLowerCase()}
// @route   PUT /api/${pluralName}/:id
// @access  Private
const update${entityName} = asyncHandler(async (req, res) => {
  const ${entityName.toLowerCase()} = await ${entityName}.findById(req.params.id);

  if (${entityName.toLowerCase()}) {
    Object.keys(req.body).forEach(key => {
      ${entityName.toLowerCase()}[key] = req.body[key];
    });

    const updated${entityName} = await ${entityName.toLowerCase()}.save();
    res.json(updated${entityName});
  } else {
    res.status(404);
    throw new Error('${entityName} not found');
  }
});

// @desc    Delete a ${entityName.toLowerCase()}
// @route   DELETE /api/${pluralName}/:id
// @access  Private
const delete${entityName} = asyncHandler(async (req, res) => {
  const ${entityName.toLowerCase()} = await ${entityName}.findById(req.params.id);

  if (${entityName.toLowerCase()}) {
    await ${entityName.toLowerCase()}.deleteOne();
    res.json({ message: '${entityName} removed' });
  } else {
    res.status(404);
    throw new Error('${entityName} not found');
  }
});

module.exports = {
  get${entityName}s,
  get${entityName}ById,
  create${entityName},
  update${entityName},
  delete${entityName},
};`;

  await fs.writeFile(
    path.join(baseDir, `backend/controllers/${entityName.toLowerCase()}Controller.js`),
    controllerContent
  );
};

/**
 * Generate routes file for an entity
 * @param {string} baseDir - Base directory path
 * @param {Object} entity - The entity
 */
const generateRoutesFile = async (baseDir, entity) => {
  const entityName = entity.Entity_Name;
  const pluralName = `${entityName.toLowerCase()}s`;
  
  const routesContent = `const express = require('express');
const {
  get${entityName}s,
  get${entityName}ById,
  create${entityName},
  update${entityName},
  delete${entityName},
} = require('../controllers/${entityName.toLowerCase()}Controller');

const router = express.Router();

router.route('/').get(get${entityName}s).post(create${entityName});
router
  .route('/:id')
  .get(get${entityName}ById)
  .put(update${entityName})
  .delete(delete${entityName});

module.exports = router;`;

  await fs.writeFile(
    path.join(baseDir, `backend/routes/${entityName.toLowerCase()}Routes.js`),
    routesContent
  );
};

/**
 * @desc    Check code generation status
 * @route   GET /api/codegen/projects/:id/status
 * @access  Private
 */
const getGenerationStatus = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json({
    status: project.status,
    logs: project.logs.slice(-10), // Return only the last 10 logs
  });
});

module.exports = {
  generateProjectCode,
  getGenerationStatus,
};