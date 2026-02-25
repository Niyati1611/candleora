import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/recent', productController.getRecentlyAdded);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);
router.post('/', authenticateToken, productController.createProduct);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

export default router;
