import { Request, Response } from 'express';
import authService from './auth.service.js';
import jwt from 'jsonwebtoken';

export class AuthController {
  /**
   * POST /api/auth/create-user
   * Called by frontend after successful Firebase login
   * Creates or updates user in database
   */
  async createOrUpdateUser(req: Request, res: Response) {
    try {
      // Firebase token verification middleware already ran
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const { displayName } = req.body;
      const { uid, email } = req.user;

      // Find or create user
      const user = await authService.findOrCreateUser(uid, email, displayName);

      // Generate JWT refresh token (valid for 7 days)
      const refreshToken = jwt.sign(
        {
          uid: user.firebaseUID,
          email: user.email,
          role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        status: 'success',
        message: 'User authenticated successfully',
        data: {
          uid: user.firebaseUID,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create or update user',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const user = await authService.getUserByUID(req.user.uid);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          uid: user.firebaseUID,
          email: user.email,
          displayName: user.displayName,
          profilePicture: user.profilePicture,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get user',
      });
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Refresh JWT token (for future use in token rotation)
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: 'error',
          message: 'Refresh token is required',
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'your-secret-key'
      ) as any;

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        {
          uid: decoded.uid,
          email: decoded.email,
          role: decoded.role,
        },
        process.env.REFRESH_TOKEN_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      console.error('Error in refreshToken:', error);
      res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
      });
    }
  }
}

export default new AuthController();
