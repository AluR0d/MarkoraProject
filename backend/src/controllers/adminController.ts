import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Campaign } from '../models/Campaign';
import { CampaignPlace } from '../models/CampaignPlace';

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const range = parseInt(req.query.range as string);
    const campaignWhere = range
      ? {
          created_at: {
            [Op.gte]: new Date(Date.now() - range * 24 * 60 * 60 * 1000),
          },
        }
      : {};

    const totalCampaigns = await Campaign.count({ where: campaignWhere });

    const totalCampaignPlaces = await CampaignPlace.count({
      include: [
        {
          model: Campaign,
          where: campaignWhere,
        },
      ],
    });

    const averagePlacesPerCampaign =
      totalCampaigns === 0 ? 0 : totalCampaignPlaces / totalCampaigns;

    const totalCreditSpent = totalCampaigns * 5;

    const campaignPlaces = await CampaignPlace.findAll({
      include: [
        {
          model: Campaign,
          where: campaignWhere,
        },
      ],
      attributes: ['send_count'],
    });

    const totalEmailsSent = campaignPlaces.reduce(
      (sum, cp) => sum + (cp.send_count || 0),
      0
    );

    res.json({
      totalCampaigns,
      averagePlacesPerCampaign,
      totalCreditSpent,
      totalEmailsSent,
    });

    return;
  } catch (error) {
    console.error('Error generando el dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
    return;
  }
};
