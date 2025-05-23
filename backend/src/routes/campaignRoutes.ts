import express from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = express.Router();

router.post('/', authenticateJWT, CampaignController.create);
router.get('/', CampaignController.getAll);
router.get('/mine', authenticateJWT, CampaignController.getMyCampaigns);
router.post(
  '/send-scheduled',
  authenticateJWT,
  CampaignController.sendScheduled
);
router.get('/:id', CampaignController.getOne);
router.post('/:id/send', authenticateJWT, CampaignController.sendEmails);
router.post('/:id/toggle', authenticateJWT, CampaignController.toggleActive);

export default router;
