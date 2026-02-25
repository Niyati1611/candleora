import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminController.adminLogin);
router.get('/validate', authenticateToken, adminController.validateToken);
router.get('/dashboard-stats', authenticateToken, adminController.getDashboardStats);
// list registered users (requires auth token)
router.get('/users', authenticateToken, adminController.listUsers);

export default router;
