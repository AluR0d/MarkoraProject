import { createRoleSchema } from '../schemas/Role/createRoleSchema';
import { updateRoleSchema } from '../schemas/Role/updateRoleSchema';
import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';

export class RoleController {
  getAllRoles = async (_req: Request, res: Response) => {
    try {
      const roles = await RoleService.getAllRoles();
      if (roles.length === 0) {
        res.status(404).json({ message: 'No roles found' });
        return;
      }

      res.status(200).json(roles);
      return;
    } catch (error) {
      console.error(`Error fetching roles: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  getRoleByPk = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const role = await RoleService.getRoleByPk(Number(id));
      if (!role) {
        res.status(404).json({ message: 'No role found' });
        return;
      }

      res.status(200).json(role);
      return;
    } catch (error) {
      console.error(`Error fetching role: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  createRole = async (req: Request, res: Response) => {
    const result = createRoleSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    } else {
      try {
        const newRole = await RoleService.createRole(result.data);

        res.status(201).json(newRole);
        return;
      } catch (error) {
        console.error(`Error creating role: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = updateRoleSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    } else {
      try {
        const existingRole = await RoleService.getRoleByPk(Number(id));
        if (!existingRole) {
          res.status(404).json({ message: 'Role not found' });
          return;
        }

        const updatedRole = await RoleService.updateRole(
          Number(id),
          result.data
        );

        res.status(200).json(updatedRole);
        return;
      } catch (error) {
        console.error(`Error updating role: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  deleteRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const existingRole = await RoleService.getRoleByPk(Number(id));
      if (!existingRole) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }

      const deletedRole = await RoleService.deleteRole(Number(id));
      if (!deletedRole) {
        res.status(400).json({ message: 'No role was deleted' });
        return;
      }
      res.status(200).json({ message: 'Role deleted successfully' });
      return;
    } catch (error) {
      console.error(`Error deleting role: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
