import { Role } from '../models/Role';
import { CreateRoleDTO } from '../schemas/Role/createRoleSchema';
import { UpdateRoleDTO } from '../schemas/Role/updateRoleSchema';

export class RoleService {
  static async getAllRoles() {
    return await Role.findAll();
  }

  static async getRoleByPk(id: number) {
    return await Role.findByPk(id);
  }

  static async createRole(data: CreateRoleDTO) {
    return await Role.create(data);
  }

  static async updateRole(id: number, data: UpdateRoleDTO) {
    const [affectedRows] = await Role.update(data, { where: { id } });
    if (affectedRows === 0) return null;

    return await Role.findByPk(id);
  }

  static async deleteRole(id: number) {
    const affectedRows = await Role.destroy({ where: { id } });
    return affectedRows > 0;
  }
}
