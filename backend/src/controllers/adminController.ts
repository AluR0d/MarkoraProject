import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Campaign } from '../models/Campaign';
import { CampaignPlace } from '../models/CampaignPlace';

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const range = parseInt(req.query.range as string); // en días
    const campaignWhere = range
      ? {
          created_at: {
            [Op.gte]: new Date(Date.now() - range * 24 * 60 * 60 * 1000),
          },
        }
      : {};

    // Total de campañas creadas dentro del rango
    const totalCampaigns = await Campaign.count({ where: campaignWhere });

    // Total de CampaignPlace relacionadas con campañas del rango
    const totalCampaignPlaces = await CampaignPlace.count({
      include: [
        {
          model: Campaign,
          where: campaignWhere,
        },
      ],
    });

    // Media de lugares por campaña
    const averagePlacesPerCampaign =
      totalCampaigns === 0 ? 0 : totalCampaignPlaces / totalCampaigns;

    // Créditos gastados (5 por campaña)
    const totalCreditSpent = totalCampaigns * 5;

    // Emails enviados (suma de send_count donde campaign creada en el rango)
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
    console.error('❌ Error generando el dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
    return;
  }
};
