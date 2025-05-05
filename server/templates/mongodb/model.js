// server/templates/mongodb/model.js
export default `import mongoose from 'mongoose';

const {{ModelName}}Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  // Add other fields as needed
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('{{ModelName}}', {{ModelName}}Schema);`;