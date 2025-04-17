import { Request, Response } from 'express';
import { User } from '../models/User';

export class UserController {
  getUserByPk = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
      return;
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
