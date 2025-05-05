// server/utils/zipGenerator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateZipFile = async (projectName, files) => {
  return new Promise((resolve, reject) => {
    try {
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const zipFilePath = path.join(tempDir, `${projectName.replace(/\s+/g, '-')}-code.zip`);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      
      output.on('close', () => {
        resolve(zipFilePath);
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.pipe(output);
      
      // Add files to the archive
      files.forEach(file => {
        const dirPath = path.dirname(file.path);
        
        // Create directories if they don't exist
        const tempFilePath = path.join(tempDir, 'temp-file');
        fs.writeFileSync(tempFilePath, file.content);
        
        archive.file(tempFilePath, { name: file.path });
      });
      
      archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
};