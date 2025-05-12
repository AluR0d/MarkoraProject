import { AuthService } from '../services/authServices';
import { Request, Response } from 'express';
import { createUserSchema } from '../schemas/User/createUserSchema';
import { loginUserSchema } from '../schemas/User/loginUserSchema';

export class AuthController {
  register = async (req: Request, res: Response) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    try {
      const user = await AuthService.registerUser(result.data);
      res.status(201).json({ user });
      return;
    } catch (error) {
      console.error(`Error registering user: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  login = async (req: Request, res: Response) => {
    const result = loginUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    try {
      const loggedUser = await AuthService.loginUser(result.data);

      res.status(200).json({
        message: 'Login successful',
        user: loggedUser.user,
        token: loggedUser.token,
      });
      return;
    } catch (error) {
      console.error(`Error logging in user: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
