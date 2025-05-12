import { Owner } from '../models/Owner';
import { CreateOwnerDTO } from '../schemas/Owner/createOwnerSchema';
import { UpdateOwnerDTO } from '../schemas/Owner/updateOwnerSchema';

export class OwnerService {
  static async getAllOwners() {
    const owners = await Owner.findAll();
    return owners;
  }

  static async getOwnerByPk(id: number) {
    const owner = await Owner.findByPk(id);
    return owner;
  }

  static async createOwner(data: CreateOwnerDTO) {
    const owner = await Owner.create(data);
    return owner;
  }

  static async updateOwner(id: number, data: UpdateOwnerDTO) {
    const [affectedRows] = await Owner.update(data, { where: { id } });
    if (affectedRows === 0) return null;

    const updatedOwner = await Owner.findByPk(id);
    return updatedOwner;
  }

  static async deleteOwner(id: number) {
    const affectedRows = await Owner.destroy({ where: { id } });
    return affectedRows > 0;
  }
}
