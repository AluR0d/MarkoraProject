import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = Router();
const userController = new UserController();

router.get('/', authenticateJWT, userController.getAllUsers);
router.get('/:id', userController.getUserByPk);
router.get('/:id/roles', userController.getUserRoles);
router.post('/', userController.createUser);
router.post('/:id/roles', userController.assignUserRoles);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
