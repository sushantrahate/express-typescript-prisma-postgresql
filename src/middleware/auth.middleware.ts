import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { createResponse } from '../utils/response.util';

const secret: Secret = process.env.JWT_SECRET as string;
// const env: string = process.env.NODE_ENV as string;

interface AuthPayload {
  userId: string;
  role: string;
  dealerId: string;
}

// Augment the Request type to include the userId property
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
      dealerId?: string;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json(createResponse(false, null, 'No token provided'));
  }

  try {
    const decodedToken = jwt.verify(token, secret) as AuthPayload;
    req.userId = decodedToken.userId;
    req.role = decodedToken.role;
    req.dealerId = decodedToken.dealerId;
    next();
  } catch (error) {
    return res.status(401).json(createResponse(false, null, 'Invalid token'));
  }
};

const checkUserRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json(createResponse(false, null, 'No token provided'));
    }

    try {
      const decodedToken = jwt.verify(token, secret) as AuthPayload;
      if (allowedRoles.includes(decodedToken.role)) {
        return next();
      }
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    } catch (error) {
      return res.status(401).json(createResponse(false, null, 'Invalid token'));
    }
  };
};

export { auth, checkUserRole };
