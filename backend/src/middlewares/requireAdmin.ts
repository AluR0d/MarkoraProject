import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticateJWT';

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || !user.roles?.includes('Administrator')) {
    res.status(403).json({ message: 'Access denied. Admins only.' });
    return;
  }

  next();
};
