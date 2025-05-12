import { UserService } from './userService';
import { Role } from '../models/Role';
import { CreateUserDTO } from '../schemas/User/createUserSchema';
import { User } from '../models/User';
import { defaultValues } from '../constants/defaultValues';
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async registerUser(data: CreateUserDTO) {
    const existing = await UserService.getUserByEmail(data.email);
    if (existing) throw new Error('User already exists');

    const user = await UserService.createUser(data);
    const defaultRole = await Role.findOne({
      where: { name: defaultValues.d_userRole },
    });

    if (defaultRole) await user.$add('roles', [defaultRole.id]);

    return user;
  }

  static async loginUser(data: Omit<CreateUserDTO, 'name'>) {
    const user = await User.findOne({
      where: { email: data.email },
      include: [Role],
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValid = await UserService.comparePasswords(
      data.password,
      user.password
    );

    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    const payload = {
      userId: user.id,
      roles: user.roles.map((role) => role.name),
    };
    const token = await generateToken(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: payload.roles,
      },
    };
  }
}
