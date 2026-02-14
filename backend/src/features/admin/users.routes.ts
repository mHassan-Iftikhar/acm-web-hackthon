import { Router } from 'express';
import { verifyAuth, requireRole } from '../../middleware/auth.js';
import { createUser, deleteUser, listUsers } from './users.controller.js';

const router = Router();

// Admin-only user management
router.get('/users', verifyAuth, requireRole(['admin']), listUsers);
router.post('/users', verifyAuth, requireRole(['admin']), createUser);
router.delete('/users/:id', verifyAuth, requireRole(['admin']), deleteUser);

export default router;
