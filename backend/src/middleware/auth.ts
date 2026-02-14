import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase-admin';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        emailVerified: boolean;
      };
    }
  }
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No authorization token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      emailVerified: decodedToken.email_verified || false,
    };

    next();
  } catch (error: any) {
    console.error('Token verification error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      code: 'AUTH_FAILED',
    });
  }
};

// Optional: Role-based authorization middleware (for later sprints)
export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      // TODO: Fetch user role from database in future sprints
      // For now, just proceed
      next();
    } catch (error) {
      res.status(403).json({
        status: 'error',
        message: 'Authorization failed',
      });
    }
  };
};
