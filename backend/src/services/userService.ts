import { CreateUserDTO } from '../schemas/User/createUserSchema';
import { User } from '../models/User';
import { UpdateUserDTO } from '../schemas/User/updateUserSchema';
import bcrypt from 'bcrypt';
import { Role } from '../models/Role';
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
    const dataUpdated = data;
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      dataUpdated.password = hashedPassword;
    }
    const [affectedRows] = await User.update(dataUpdated, { where: { id } });
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

  static async getRolesForUser(id: number) {
    return await User.findByPk(id, {
      include: [Role],
    });
  }

  static async assignRolesForUser(userId: number, roleId: number[]) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.$set('roles', roleId);
      return await user.$get('roles');
    }
    return null;
  }

  static async getUserByEmail(email: string) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }
}
