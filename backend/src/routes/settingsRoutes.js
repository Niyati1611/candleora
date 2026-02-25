import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public: fetch settings
router.get('/', settingsController.getSettings);

// Admin: update title
router.put('/', authenticateToken, settingsController.updateSettings);

export default router;
