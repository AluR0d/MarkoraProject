import { Router } from 'express';
import { OwnerController } from '../controllers/ownerController';

const router = Router();
const ownerController = new OwnerController();

router.get('/', ownerController.getAllOwners);
router.get('/:id', ownerController.getOwnerByPk);
router.post('/', ownerController.createOwner);
router.put('/:id', ownerController.updateOwner);
router.delete('/:id', ownerController.deleteOwner);

export default router;
