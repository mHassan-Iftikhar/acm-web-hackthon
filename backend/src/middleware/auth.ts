import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase-admin.js";

import User, { IUser } from "../models/User.js";

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        emailVerified: boolean;
        id?: string; // MongoDB User ID
        role?: string;
      };
    }
  }
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No authorization token provided",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      emailVerified: decodedToken.email_verified || false,
    };

    next();
  } catch (error: any) {
    console.error("Token verification error:", error.message);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        status: "error",
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.code === "auth/invalid-id-token") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    res.status(401).json({
      status: "error",
      message: "Authentication failed",
      code: "AUTH_FAILED",
    });
  }
};

/**
 * Middleware to verify Firebase token AND attach MongoDB User document
 */
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await verifyFirebaseToken(req, res, async () => {
    try {
      if (!req.user) return; // verifyFirebaseToken would have already sent response

      const dbUser = await User.findOne({ firebaseUID: req.user.uid });

      if (!dbUser) {
        return res.status(404).json({
          status: "error",
          message:
            "User record not found in database. Please complete registration.",
        });
      }

      req.user.id = dbUser._id.toString();
      req.user.role = dbUser.role;

      next();
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error during authentication",
      });
    }
  });
};

// Optional: Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
