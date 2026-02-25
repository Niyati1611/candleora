import express from 'express';
import filterController from '../controllers/filterController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public: get filters (for shop page)
router.get('/', filterController.getFilters);

// Protected: filter CRUD operations
router.post('/', authenticateToken, filterController.createFilter);
router.put('/:id', authenticateToken, filterController.updateFilter);
router.delete('/:id', authenticateToken, filterController.deleteFilter);

// Protected: filter value operations
router.post('/:id/values', authenticateToken, filterController.createValue);
router.put('/:filterId/values/:id', authenticateToken, filterController.updateValue);
router.delete('/:filterId/values/:id', authenticateToken, filterController.deleteValue);

export default router;
