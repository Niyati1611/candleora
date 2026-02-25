import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import * as wishlistController from '../controllers/wishlistController.js'

const router = express.Router()

router.get('/', authenticateToken, wishlistController.getWishlist)
router.post('/', authenticateToken, wishlistController.addToWishlist)
router.delete('/:product_id', authenticateToken, wishlistController.removeFromWishlist)
router.get('/check/:product_id', authenticateToken, wishlistController.checkWishlist)

export default router
