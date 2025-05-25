import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'campaign.errors.title_required')
    .max(50, 'campaign.errors.title_max'),

  message: z
    .string()
    .min(1, 'campaign.errors.message_required')
    .max(200, 'campaign.errors.message_max')
    .transform((val) => val.replace(/<[^>]*>?/gm, '').trim()),
});
