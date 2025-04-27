import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { createUserSchema } from '../schemas/createUserSchema';
import { UpdateUserSchema } from '../schemas/updateUserSchema';

export class UserController {
  getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      if (users.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
      }

      res.status(200).json(users);
      return;
    } catch (error) {
      console.error(`Error fetching users: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  getUserByPk = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await UserService.getUserByPk(Number(id));
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
      return;
    } catch (error) {
      console.error(`Error fetching user: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  createUser = async (req: Request, res: Response) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
    } else {
      try {
        const newUser = await UserService.createUser(result.data);

        res.status(201).json(newUser);
        return;
      } catch (error) {
        console.error(`Error creating user: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = UpdateUserSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
    } else {
      try {
        const existingUser = await UserService.getUserByPk(Number(id));
        if (!existingUser) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const updatedUser = await UserService.updateUser(
          Number(id),
          result.data
        );

        res.status(200).json(updatedUser);
        return;
      } catch (error) {
        console.error(`Error updating user: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const existingUser = await UserService.getUserByPk(Number(id));
      if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await UserService.deleteUser(Number(id));
      res.status(200).json({ message: 'User deleted successfully' });
      return;
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
