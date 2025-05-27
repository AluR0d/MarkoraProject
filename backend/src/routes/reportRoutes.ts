import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = Router();
const reportController = new ReportController();

router.post('/', authenticateJWT, reportController.createReport);
router.get('/my', authenticateJWT, reportController.getMyReports);

export default router;
