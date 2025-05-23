import { Campaign } from '../models/Campaign';
import { CampaignPlace } from '../models/CampaignPlace';
import { CreateCampaignDTO } from '../schemas/Campaign/createCampaignSchema';
import { Place } from '../models/Place';
import { ApiError } from '../utils/ApiError';
import { sendEmail } from './emailService';
import { Op } from 'sequelize';
import { scheduleCampaign, stopCampaign } from '../utils/campaignScheduler'; // ✅ nuevo

export class CampaignService {
  static async createCampaign(data: CreateCampaignDTO, userId: number) {
    const existingPlaces = await Place.findAll({
      where: {
        id: data.place_ids,
      },
    });

    if (existingPlaces.length !== data.place_ids.length) {
      throw new ApiError('Uno o más places seleccionados no existen', 400);
    }

    const campaign = await Campaign.create({
      title: data.title,
      message_template: data.message_template,
      user_id: userId,
      frequency: data.frequency ?? null,
    });

    const campaignPlaces = data.place_ids.map((place_id) => ({
      campaign_id: campaign.id,
      place_id,
    }));

    await CampaignPlace.bulkCreate(campaignPlaces);

    return campaign;
  }

  static async getAllCampaigns() {
    return Campaign.findAll({
      include: [CampaignPlace],
      order: [['created_at', 'DESC']],
    });
  }

  static async getCampaignById(id: number) {
    return Campaign.findByPk(id, {
      include: [
        {
          model: CampaignPlace,
          include: [Place],
        },
      ],
    });
  }

  static async sendEmails(campaignId: number) {
    const campaign = await Campaign.findByPk(campaignId, {
      include: [
        {
          model: CampaignPlace,
          include: [Place],
        },
      ],
    });

    if (!campaign) throw new ApiError('Campaign not found', 404);

    let sentCount = 0;

    for (const cp of campaign.campaignPlaces) {
      const place = cp.place;

      if (!place || !place.email || place.email.length === 0) continue;

      for (const email of place.email) {
        await sendEmail(
          email,
          `Campaña: ${campaign.title}`,
          `Buenas, ${place.name},\n\n${campaign.message_template}`
        );
      }

      await cp.update({
        sent_at: new Date(),
        send_count: (cp.send_count ?? 0) + 1,
        status: 'SENT', // ✅ restaurado para que el frontend lo detecte
      });

      sentCount++;
    }

    if (sentCount === 0) {
      throw new ApiError(
        'No se han podido enviar correos: ningún place tenía emails válidos.',
        400
      );
    }

    // ✅ Activar reenvío automático si aplica
    if (campaign.frequency && campaign.active) {
      scheduleCampaign(campaign.id, campaign.frequency, async () => {
        await this.sendEmails(campaign.id);
        await campaign.update({ last_sent_at: new Date() });
      });
    }

    return {
      message: `Correos enviados correctamente a ${sentCount} lugar(es).`,
    };
  }

  static async getCampaignsByUser(userId: number) {
    return Campaign.findAll({
      where: { user_id: userId },
      include: [
        {
          model: CampaignPlace,
          include: [Place],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  static async toggleActive(campaignId: number) {
    const campaign = await Campaign.findByPk(campaignId, {
      include: [CampaignPlace],
    });

    if (!campaign) throw new ApiError('Campaña no encontrada', 404);

    const isArchiving = campaign.active;
    const updated = await campaign.update({ active: !campaign.active });

    if (isArchiving) {
      // 🔴 Si se está archivando → detenemos el envío automático
      stopCampaign(campaign.id);
    } else {
      // 🟢 Si se está reactivando → reiniciar estado y relanzar temporizador
      await Promise.all(
        campaign.campaignPlaces.map((cp) =>
          cp.update({
            status: 'PENDING',
            sent_at: null,
            send_count: 0,
          })
        )
      );

      // Solo programar si tiene frecuencia
      if (campaign.frequency) {
        scheduleCampaign(campaign.id, campaign.frequency, async () => {
          await CampaignService.sendEmails(campaign.id);
          await campaign.update({ last_sent_at: new Date() });
        });
      }
    }

    return updated;
  }

  static async sendScheduledCampaigns() {
    const now = new Date();

    const campaigns = await Campaign.findAll({
      where: {
        active: true, // 🔒 solo campañas activas
        frequency: { [Op.not]: null },
      },
      include: [
        {
          model: CampaignPlace,
          include: [Place],
        },
      ],
    });

    let sentCount = 0;

    for (const campaign of campaigns) {
      // doble chequeo por si el valor activo cambia entre consultas
      if (!campaign.active) continue;

      const lastSent = campaign.last_sent_at;
      const frequency = campaign.frequency!;

      const secondsSinceLast = lastSent
        ? (now.getTime() - new Date(lastSent).getTime()) / 1000
        : Infinity;

      if (secondsSinceLast >= frequency) {
        console.log(`⏰ Enviando campaña automática: ${campaign.title}`);
        try {
          await this.sendEmails(campaign.id);
          await campaign.update({ last_sent_at: now });
          sentCount++;
        } catch (err) {
          console.error(`❌ Error al enviar campaña ${campaign.id}:`, err);
        }
      }
    }

    return {
      message: `Se revisaron ${campaigns.length} campañas, ${sentCount} enviadas automáticamente.`,
    };
  }
}
