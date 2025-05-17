import { AuthService } from '../services/authServices';
import { Request, Response } from 'express';
import { createUserSchema } from '../schemas/User/createUserSchema';
import { loginUserSchema } from '../schemas/User/loginUserSchema';
import { UserService } from '../services/userService';
import { ApiError } from '../utils/ApiError';

export class AuthController {
  register = async (req: Request, res: Response) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const existing = await UserService.getUserByEmail(result.data.email);
    if (existing) {
      throw new ApiError('User alredy exists', 409);
    }
    const user = await AuthService.registerUser(result.data);
    res.status(201).json({ user });
    return;
  };

  login = async (req: Request, res: Response) => {
    const result = loginUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    const existing = await UserService.getUserByEmail(result.data.email);
    if (existing === null) {
      throw new ApiError('User not found', 404);
    }
    const loggedUser = await AuthService.loginUser(result.data);

    res.status(200).json({
      message: 'Login successful',
      user: loggedUser.user,
      token: loggedUser.token,
    });
    return;
  };
}
