import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticateJWT, authController.getCurrentUser);

export default router;
