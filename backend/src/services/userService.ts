import { CreateUserDTO } from '../schemas/createUserSchema';
import { User } from '../models/User';
import { UpdateUserDTO } from '../schemas/updateUserSchema';

export class UserService {
  static async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  static async getUserByPk(id: number) {
    const user = await User.findByPk(id);
    return user;
  }

  static async createUser(data: CreateUserDTO) {
    const user = await User.create(data);
    return user;
  }

  static async updateUser(id: number, data: UpdateUserDTO) {
    const [affectedRows] = await User.update(data, { where: { id } });
    if (affectedRows === 0) return null;

    const updatedUser = await User.findByPk(id);
    return updatedUser;
  }
}
