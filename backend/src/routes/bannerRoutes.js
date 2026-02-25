import express from 'express';
import * as bannerController from '../controllers/bannerController.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/banners');
import fs from 'fs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// public route to list banner images (useful for frontend carousel)
router.get('/', bannerController.listBanner);

// admin-only routes
router.post('/', authenticateToken, upload.single('image'), bannerController.uploadImage);
router.delete('/:id', authenticateToken, bannerController.deleteImage);
router.put('/reorder', authenticateToken, bannerController.reorderImages);

export default router;
