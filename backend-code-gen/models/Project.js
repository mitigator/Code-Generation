// backend-code-gen/models/Project.js
// Make sure your Project model has these fields
const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  Entity_Name: String,
  Entity_Description: String,
  Fields: [String]
});

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'generating', 'completed', 'failed'],
      default: 'pending',
    },
    generatedCode: {
      downloadUrl: {
        type: String,
        default: null,
      },
      directoryPath: {
        type: String,
        default: null,
      },
    },
    logs: [{
      message: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      level: {
        type: String,
        enum: ['info', 'warning', 'error'],
        default: 'info',
      },
    }],
    acceptedEntities: [entitySchema],
    rejectedEntities: [entitySchema],
    generatedStructure: {
      type: Object,
      default: {},
    },
    flowiseCalls: [{
      flowId: String,
      status: String,
      result: Object,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Virtual for download URL
projectSchema.virtual('downloadLink').get(function () {
  return this.generatedCode.downloadUrl 
    ? `/api/projects/${this._id}/download` 
    : null;
});

// Add index for faster queries
projectSchema.index({ user: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;