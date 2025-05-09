const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  },
  {
    timestamps: true,
  }
);

// Add any methods or middleware here

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;