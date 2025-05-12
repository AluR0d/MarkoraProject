import { Request, Response } from 'express';
import { OwnerService } from '../services/ownerService';
import { createOwnerSchema } from '../schemas/Owner/createOwnerSchema';
import { updateOwnerSchema } from '../schemas/Owner/updateOwnerSchema';

export class OwnerController {
  getAllOwners = async (_req: Request, res: Response) => {
    try {
      const owners = await OwnerService.getAllOwners();

      if (owners.length === 0) {
        res.status(404).json({ message: 'No owners found' });
        return;
      }

      res.status(200).json(owners);
      return;
    } catch (error) {
      console.error(`Error fetching owners:  ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  getOwnerByPk = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const owner = await OwnerService.getOwnerByPk(Number(id));

      if (!owner) {
        res.status(404).json({ message: 'Owner not found' });
        return;
      }

      res.status(200).json(owner);
      return;
    } catch (error) {
      console.error(`Error fetching owner: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  createOwner = async (req: Request, res: Response) => {
    const result = createOwnerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    } else {
      try {
        const createdOwner = await OwnerService.createOwner(result.data);

        res.status(201).json(createdOwner);
        return;
      } catch (error) {
        console.error(`Error creating owner: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  updateOwner = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = updateOwnerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    } else {
      try {
        const existingOwner = await OwnerService.getOwnerByPk(Number(id));

        if (!existingOwner) {
          res.status(404).json({ message: 'Owner not found' });
          return;
        }

        const updatedOwner = await OwnerService.updateOwner(
          Number(id),
          result.data
        );

        if (!updatedOwner) {
          res.status(400).json({ message: 'Failed to update owner' });
          return;
        }

        res.status(200).json(updatedOwner);
        return;
      } catch (error) {
        console.error(`Error updating owner: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
    }
  };

  deleteOwner = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const existingOwner = await OwnerService.getOwnerByPk(Number(id));

      if (!existingOwner) {
        res.status(404).json({ message: 'Owner not found' });
        return;
      }

      const deletedOwner = await OwnerService.deleteOwner(Number(id));
      if (!deletedOwner) {
        res.status(400).json({ message: 'No owner was deleted' });
        return;
      }

      res.status(200).json({ message: 'Owner deleted successfully' });
      return;
    } catch (error) {
      console.error(`Error deleting owner: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
