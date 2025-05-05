// server/models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: {
    frontend: [String],
    backend: [String],
    database: [String],
    ai: [String]
  },
  generatedFiles: [{
    path: String,
    content: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Project', ProjectSchema);