import express from 'express';
import { verifyFirebaseToken } from '../../middleware/auth.js';
import aiController from './ai.controller.js';

const router = express.Router();

// AI Chat Routes
// Optional auth - works without login but provides better context when authenticated
router.post('/chat', (req, res, next) => {
    // Try to verify token if present, but don't fail if not
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        verifyFirebaseToken(req, res, next);
    } else {
        next();
    }
}, aiController.chat);

router.get('/quick-actions', aiController.getQuickActions);

export default router;
