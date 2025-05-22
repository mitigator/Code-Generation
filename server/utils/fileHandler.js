import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to data directory
const dataDir = path.join(__dirname, '..', 'data');

/**
 * Ensure the data directory exists
 */
export async function ensureDataDirExists() {
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Get data directory path
 */
export function getDataDir() {
  return dataDir;
}

/**
 * Save file to data directory
 * @param {string} filename - Name of the file to save
 * @param {Object|string} data - Data to save in the file
 * @returns {Promise<string>} - Path to the saved file
 */
export async function saveFile(filename, data) {
  await ensureDataDirExists();
  const filePath = path.join(dataDir, filename);
  
  // If data is an object, stringify it
  const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
  
  await fs.writeFile(filePath, content);
  return filePath;
}

/**
 * Read file from data directory
 * @param {string} filename - Name of the file to read
 * @returns {Promise<Object|string>} - File content
 */
export async function readFile(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    try {
      // Try to parse as JSON
      return JSON.parse(data);
    } catch (parseError) {
      // Return as string if not valid JSON
      return data;
    }
  } catch (error) {
    throw new Error(`Failed to read file: ${filename} - ${error.message}`);
  }
}

/**
 * Get file path
 * @param {string} filename - Name of the file
 * @returns {string} - Full path to the file
 */
export function getFilePath(filename) {
  return path.join(dataDir, filename);
}