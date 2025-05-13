import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to data directory
const dataDir = path.join(__dirname, '..', 'data');

// Ensure data directory exists
export async function ensureDataDirExists() {
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Get data directory path
export function getDataDir() {
  return dataDir;
}

// Save file to data directory
export async function saveFile(filename, data) {
  await ensureDataDirExists();
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

// Read file from data directory
export async function readFile(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read file: ${filename}`);
  }
}

// Get file path
export function getFilePath(filename) {
  return path.join(dataDir, filename);
}