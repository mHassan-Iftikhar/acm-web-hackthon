import express from 'express';
import authController from './auth.controller';
import { verifyFirebaseToken } from '../../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/create-user
 * Create or update user after Firebase authentication
 * Protected: Requires valid Firebase ID token
 */
router.post('/create-user', verifyFirebaseToken, (req, res) => {
  authController.createOrUpdateUser(req, res);
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 * Protected: Requires valid Firebase ID token
 */
router.get('/me', verifyFirebaseToken, (req, res) => {
  authController.getCurrentUser(req, res);
});

/**
 * POST /api/auth/refresh-token
 * Refresh JWT token
 * Public: Can be called with valid refresh token
 */
router.post('/refresh-token', (req, res) => {
  authController.refreshToken(req, res);
});

export default router;
