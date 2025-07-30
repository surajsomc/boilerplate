const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload profile picture
router.post('/profile-picture', authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload an image file'
      });
    }

    const { originalname, buffer, mimetype } = req.file;
    
    // Generate unique filename
    const fileExtension = path.extname(originalname);
    const filename = `profile_${req.user.id}_${uuidv4()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Process image with sharp
    const processedImageBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Save processed image
    fs.writeFileSync(filepath, processedImageBuffer);

    // Generate URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    res.json({
      message: 'Profile picture uploaded successfully',
      imageUrl,
      filename
    });
  } catch (error) {
    next(error);
  }
});

// Delete uploaded file
router.delete('/profile-picture/:filename', authenticateToken, async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Check if file belongs to user (basic security check)
    if (!filename.includes(req.user.id)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own files'
      });
    }

    // Delete file
    fs.unlinkSync(filepath);

    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get file info
router.get('/profile-picture/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Get file stats
    const stats = fs.statSync(filepath);

    res.json({
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 