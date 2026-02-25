import express from 'express';
import { submitContact, listContacts, deleteContact } from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authenticateToken, listContacts);
router.delete('/:id', authenticateToken, deleteContact);

export default router;
