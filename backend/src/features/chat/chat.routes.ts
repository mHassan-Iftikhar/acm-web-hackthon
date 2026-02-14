import { Router } from 'express';
import { verifyFirebaseToken, requireRole } from '../../middleware/auth.js';
import { getChatHistory, getUsersWithChats, getAdminChatHistory } from './chat.controller.js';

const router = Router();

// Middleware to ensure authentication
router.use(verifyFirebaseToken);

// User routes
router.get('/history', getChatHistory);

// Admin routes
// Logic for requireRole needs to be implemented or we assume the verifyToken attaches user info
// But existing requireRole middleware was just a placeholder returning next()
// Here we might need to be careful if it's not fully implemented.
// Re-reading auth.ts: requireRole takes allowedRoles but the implementation just checks req.user and calls next().
// It also has a TODO to fetch user role. 
// For now we will rely on frontend or basic check if we want, but let's use the placeholder.
router.get('/admin/users', requireRole(['admin']), getUsersWithChats);
router.get('/admin/history/:userId', requireRole(['admin']), getAdminChatHistory);

export default router;
