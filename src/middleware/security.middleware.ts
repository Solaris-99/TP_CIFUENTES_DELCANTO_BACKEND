import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseError } from '../common/errors/ResponseError.ts';

export interface DecodedToken {
  id: string;
  is_coordinator: boolean;
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ResponseError(401, 'Authentication token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ResponseError(500, 'Internal server error: JWT secret not configured');
    }
    const decoded = jwt.verify(token, secret) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ResponseError(401, 'Authentication token expired');
    }
    throw new ResponseError(401, 'Invalid authentication token');
  }
};
