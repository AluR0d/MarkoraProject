import { Router } from 'express';
import { RoleController } from '../controllers/roleController';

const router = Router();
const roleController = new RoleController();

router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleByPk);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

export default router;
