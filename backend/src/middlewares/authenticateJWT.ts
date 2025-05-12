import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    roles: string[];
  };
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET!);

    req.user = {
      userId: decoded.userId,
      roles: decoded.roles,
    };

    return next();
  } catch (err) {
    console.error('JWT error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
