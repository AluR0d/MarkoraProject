import { CreateUserDTO } from '../schemas/User/createUserSchema';
import { User } from '../models/User';
import { UpdateUserDTO } from '../schemas/User/updateUserSchema';
import bcrypt from 'bcrypt';
import { Role } from '../models/Role';
export class UserService {
  static async getAllUsers() {
    const users = await User.findAll({
      include: [Role],
    });
    return users;
  }

  static async getUserByPk(id: number) {
    const user = await User.findByPk(id);
    return user;
  }

  static async createUser(data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { roles, ...rest } = data;

    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    let roleIds: number[] = [];

    if (roles && Array.isArray(roles) && roles.length > 0) {
      roleIds = roles;
    } else {
      const basicRole = await Role.findOne({ where: { name: 'Basic' } });
      if (basicRole) {
        roleIds = [basicRole.id];
      }
    }

    await user.$set('roles', roleIds);

    return await User.findByPk(user.id, { include: [Role] });
  }

  static async updateUser(id: number, data: UpdateUserDTO) {
    const { roles, ...dataUpdated } = data;

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdated.password = hashedPassword;
    }

    const [affectedRows] = await User.update(dataUpdated, { where: { id } });
    if (affectedRows === 0) return null;

    // ✅ Asignar roles si llegan
    if (roles && Array.isArray(roles)) {
      await this.assignRolesForUser(id, roles);
    }

    return await User.findByPk(id, { include: [Role] });
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
