const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  processDescription, 
  generateEntities,
  refineEntities
} = require('../controllers/apiController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/description', upload.none(), processDescription);
router.post('/generate-entities', upload.none(), generateEntities);
router.post('/refine-entities', upload.none(), refineEntities);

module.exports = router;