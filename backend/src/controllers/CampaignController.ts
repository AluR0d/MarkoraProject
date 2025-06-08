import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../services/campaignService';
import { createCampaignSchema } from '../schemas/Campaign/createCampaignSchema';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/authenticateJWT';

export class CampaignController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    const result = createCampaignSchema.safeParse(req.body);

    if (!result.success) {
      return next(new ApiError('Invalid input data', 400));
    }

    try {
      console.log('req.user:', req.user);

      const userId = req.user!.userId;
      const campaign = await CampaignService.createCampaign(
        result.data,
        userId
      );
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const campaigns = await CampaignService.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    console.log('req.params.id recibido:', req.params.id);

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ApiError('ID de campaña inválido', 400));
    }

    try {
      const campaign = await CampaignService.getCampaignById(id);
      if (!campaign) {
        return next(new ApiError('Campaign not found', 404));
      }
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  }

  static async sendEmails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CampaignService.sendEmails(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMyCampaigns(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log('getMyCampaigns userId:', req.user);

      const userId = Number(req.user!.userId);
      if (isNaN(userId)) {
        return next(new ApiError('ID de usuario inválido', 400));
      }
      const campaigns = await CampaignService.getCampaignsByUser(userId);
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  }

  static async toggleActive(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const campaignId = Number(req.params.id);
      if (isNaN(campaignId)) {
        return next(new ApiError('ID de campaña inválido', 400));
      }

      const campaign = await CampaignService.toggleActive(campaignId);
      res.json({
        message: `Campaña ${campaign.active ? 'reactivada' : 'archivada'} correctamente.`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendScheduled(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CampaignService.sendScheduledCampaigns();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const campaignId = Number(req.params.id);
      if (isNaN(campaignId)) {
        return next(new ApiError('ID de campaña inválido', 400));
      }

      const result = await CampaignService.deleteCampaign(campaignId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
