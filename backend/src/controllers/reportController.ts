import { Response } from 'express';
import { ReportService } from '../services/reportService';
import { AuthRequest } from '../middlewares/authenticateJWT';

export class ReportController {
  createReport = async (req: AuthRequest, res: Response) => {
    try {
      const { title, range, data_snapshot } = req.body;

      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const report = await ReportService.create({
        title,
        range,
        user_id: req.user.userId,
        data_snapshot,
      });

      res.status(201).json(report);
      return;
    } catch (err) {
      console.error('Error creando el informe:', err);
      res.status(500).json({ message: 'Error creating report' });
      return;
    }
  };

  getMyReports = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const reports = await ReportService.findByUser(req.user.userId);
      res.json(reports);
      return;
    } catch (err) {
      console.error('Error al obtener informes:', err);
      res.status(500).json({ message: 'Error fetching reports' });
      return;
    }
  };
}
