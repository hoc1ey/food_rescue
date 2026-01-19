import { NextFunction, Response } from 'express';
import { UserType } from '../generated/prisma/index.js';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userType: UserType;
      };
    }
  }
}

export const protectRoute = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, 'No authorization header provided', null, 401);
    }

    if (!authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Invalid authorization format. Use: Bearer <token>', null, 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'No token provided', null, 401);
    }

    if (!process.env.JWT_SECRET) {
      return sendError(res, 'JWT secret is not configured', null, 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      userType: UserType;
      iat?: number;
      exp?: number;
    };

    req.user = {
      userId: decoded.userId,
      userType: decoded.userType
    };

    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired', null, 401);
    }

    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token', null, 401);
    }

    return sendError(res, 'Authentication failed', null, 401);
  }
};

export const restrictTo = (userType: UserType) => (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'User not authenticated', null, 401);
  }

  if (req.user.userType !== userType) {
    return sendError(res, 'Access denied: Insufficient privileges', null, 403);
  }

  next();
};
