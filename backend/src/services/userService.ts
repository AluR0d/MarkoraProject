import { CreateUserDTO } from '../schemas/createUserSchema';
import { User } from '../models/User';
import { UpdateUserDTO } from '../schemas/updateUserSchema';
import bcrypt from 'bcrypt';
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
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  static async updateUser(id: number, data: UpdateUserDTO) {
    const [affectedRows] = await User.update(data, { where: { id } });
    if (affectedRows === 0) return null;

    const updatedUser = await User.findByPk(id);
    return updatedUser;
  }

  static async deleteUser(id: number) {
    const affectedRows = await User.destroy({ where: { id } });
    return affectedRows > 0;
  }

  static async comparePasswords(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
