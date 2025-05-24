import { UserService } from './userService';
import { Role } from '../models/Role';
import { CreateUserDTO } from '../schemas/User/createUserSchema';
import { User } from '../models/User';
import { defaultValues } from '../constants/defaultValues';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { sendPasswordResetEmail } from './emailService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  static async registerUser(data: CreateUserDTO) {
    const existing = await UserService.getUserByEmail(data.email);
    if (existing) {
      throw new ApiError(
        'Ya existe un usuario con este email',
        409,
        'USER_ALREADY_EXISTS'
      );
    }

    const user = await UserService.createUser(data);
    const defaultRole = await Role.findOne({
      where: { name: defaultValues.d_userRole },
    });

    if (defaultRole) await user!.$add('roles', [defaultRole.id]);

    return user;
  }

  static async loginUser(data: Omit<CreateUserDTO, 'name'>) {
    const user = await User.findOne({
      where: { email: data.email },
      include: [Role],
    });

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }
    const isValid = await UserService.comparePasswords(
      data.password,
      user.password
    );

    if (!isValid) {
      throw new ApiError('Invalid credentials', 401);
    }
    const payload = {
      id: user.id,
      //name: user.name,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      //balance: user.balance,
    };
    const token = await generateToken(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        //name: user.name,
        //email: user.email,
        roles: payload.roles,
        //balance: user.balance,
      },
    };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) return;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_RESET_SECRET!, {
      expiresIn: '1h',
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetLink);
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET!) as {
        userId: number;
      };
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new ApiError('Usuario no encontrado', 404);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
    } catch (err: any) {
      throw new ApiError('Token inválido o expirado', 400);
    }
  }
}
