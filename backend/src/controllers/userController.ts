import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { createUserSchema } from '../schemas/User/createUserSchema';
import { updateUserSchema } from '../schemas/User/updateUserSchema';
import { ApiError } from '../utils/ApiError';

export class UserController {
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const { roles } = (req as any).user;

      if (!roles || !roles.includes('Administrator')) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
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
      const existingUser = await UserService.getUserByEmail(result.data.email);
      if (existingUser) {
        throw new ApiError('Email already registered', 409);
      }
      const newUser = await UserService.createUser(result.data);

      res.status(201).json(newUser);
      return;
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = updateUserSchema.safeParse(req.body);

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

      const deletedUser = await UserService.deleteUser(Number(id));
      if (!deletedUser) {
        res.status(400).json({ message: 'No user was deleted' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
      return;
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  // getUserRoles = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   try {
  //     const roles = await UserService.getRolesForUser(Number(id));
  //     if (!roles) {
  //       res.status(404).json({ message: 'No user was found to show roles.' });
  //       return;
  //     }

  //     res.status(200).json(roles);
  //     return;
  //   } catch (error) {
  //     console.error(`Error fetching roles from user: ${error}`);
  //     res.status(500).json({ message: 'Internal server error' });
  //     return;
  //   }
  // };

  getUserRoles = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const userWithRoles = await UserService.getRolesForUser(Number(id));
      if (!userWithRoles) {
        res.status(404).json({ message: 'No user was found to show roles.' });
        return;
      }

      const roleNames = userWithRoles.roles.map((r: any) => r.name); // 👈 solo nombres
      res.status(200).json(roleNames);
    } catch (error) {
      console.error(`Error fetching roles from user: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  assignUserRoles = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { roleId } = req.body;

    if (!Array.isArray(roleId)) {
      res.status(400).json({
        message: 'roleIds must be an array of numbers and they must exist',
      });
      return;
    }

    try {
      const roles = await UserService.assignRolesForUser(
        Number(userId),
        roleId
      );
      if (!roles) {
        res.status(404).json({ message: 'No user was found to add roles' });
        return;
      }

      const updatedUserRoles = await UserService.getRolesForUser(
        Number(userId)
      );
      res.status(200).json(updatedUserRoles);
      return;
    } catch (error) {
      console.error(`Error assigning role: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
