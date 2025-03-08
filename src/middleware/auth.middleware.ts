import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { unifiedResponse } from 'uni-response';

import { env } from '../config/env-config';

// Environment variable for JWT secret
const secret: Secret = env.JWT_SECRET as string;

// AuthPayload interface
interface AuthPayload {
  userId: string;
  role: string;
  dealerId: string;
}

// Augment the Express Request object to include custom properties
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
      dealerId?: string;
    }
  }
}

/**
 * Authentication Service Class
 * Contains methods for authentication and role-based access control.
 */
class AuthService {
  private secret: Secret;

  constructor(secret: Secret) {
    this.secret = secret;
  }

  /**
   * Authenticate and validate the JWT token
   */
  public auth(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json(unifiedResponse(false, 'No token provided'));
      return; // Ensures the middleware ends
    }

    try {
      const decodedToken = jwt.verify(token, this.secret) as AuthPayload;
      req.userId = decodedToken.userId;
      req.role = decodedToken.role;
      req.dealerId = decodedToken.dealerId;

      next(); // Call the next middleware
    } catch (error) {
      res.status(401).json(unifiedResponse(false, 'Invalid token'));
      return; // Ensures the middleware ends
    }
  }

  /**
   * Check if the user has the required role(s)
   */
  public checkUserRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).json(unifiedResponse(false, 'No token provided'));
        return;
      }

      try {
        const decodedToken = jwt.verify(token, this.secret) as AuthPayload;

        if (allowedRoles.includes(decodedToken.role)) {
          req.userId = decodedToken.userId;
          req.role = decodedToken.role;
          req.dealerId = decodedToken.dealerId;

          next();
          return;
        }

        res.status(403).json(unifiedResponse(false, 'Forbidden: Insufficient permissions'));
        return;
      } catch (error) {
        res.status(401).json(unifiedResponse(false, 'Invalid token'));
        return;
      }
    };
  }
}

// Instantiate AuthService
const authService = new AuthService(secret);

// Export methods for use in routes
export const auth = authService.auth.bind(authService);
export const checkUserRole = authService.checkUserRole.bind(authService);
