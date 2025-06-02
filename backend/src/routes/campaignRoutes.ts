import express from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireAdmin } from '../middlewares/requireAdmin';
import { getAdminDashboard } from '../controllers/adminController';

const router = express.Router();

router.post('/', authenticateJWT, CampaignController.create);
router.get('/', CampaignController.getAll);
router.get('/mine', authenticateJWT, CampaignController.getMyCampaigns);
router.post(
  '/send-scheduled',
  authenticateJWT,
  CampaignController.sendScheduled
);
router.get(
  '/admin/dashboard',
  authenticateJWT,
  requireAdmin,
  getAdminDashboard
);
router.get('/:id', CampaignController.getOne);
router.post('/:id/send', authenticateJWT, CampaignController.sendEmails);
router.post('/:id/toggle', authenticateJWT, CampaignController.toggleActive);
router.delete('/:id', authenticateJWT, CampaignController.delete);

export default router;
