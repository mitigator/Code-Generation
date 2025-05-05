// server/models/TechStack.js
import mongoose from 'mongoose';

const TechStackSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'ai']
  },
  name: {
    type: String,
    required: true
  },
  templates: [{
    type: String,
    required: true
  }]
});

export default mongoose.model('TechStack', TechStackSchema);