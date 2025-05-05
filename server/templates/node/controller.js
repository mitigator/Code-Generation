// server/templates/node/controller.js
export default `import {{ModelName}} from '../models/{{ModelName}}.js';

export const getAll{{ModelName}}s = async (req, res) => {
  try {
    const items = await {{ModelName}}.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(\`Error fetching {{ModelName}}s:\`, error);
    res.status(500).json({ error: \`Failed to fetch {{ModelName}}s\` });
  }
};

export const get{{ModelName}}ById = async (req, res) => {
  try {
    const item = await {{ModelName}}.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: \`{{ModelName}} not found\` });
    }
    
    res.status(200).json(item);
  } catch (error) {
    console.error(\`Error fetching {{ModelName}}:\`, error);
    res.status(500).json({ error: \`Failed to fetch {{ModelName}}\` });
  }
};

export const create{{ModelName}} = async (req, res) => {
  try {
    const newItem = new {{ModelName}}(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(\`Error creating {{ModelName}}:\`, error);
    res.status(500).json({ error: \`Failed to create {{ModelName}}\` });
  }
};

export const update{{ModelName}} = async (req, res) => {
  try {
    const updatedItem = await {{ModelName}}.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: \`{{ModelName}} not found\` });
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(\`Error updating {{ModelName}}:\`, error);
    res.status(500).json({ error: \`Failed to update {{ModelName}}\` });
  }
};

export const delete{{ModelName}} = async (req, res) => {
  try {
    const deletedItem = await {{ModelName}}.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: \`{{ModelName}} not found\` });
    }
    
    res.status(200).json({ message: \`{{ModelName}} deleted successfully\` });
  } catch (error) {
    console.error(\`Error deleting {{ModelName}}:\`, error);
    res.status(500).json({ error: \`Failed to delete {{ModelName}}\` });
  }
};`;