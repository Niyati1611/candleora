import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import * as userController from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', authenticateToken, userController.getProfile)
router.put('/profile', authenticateToken, userController.updateProfile)
router.get('/orders', authenticateToken, userController.getUserOrders)

export default router
