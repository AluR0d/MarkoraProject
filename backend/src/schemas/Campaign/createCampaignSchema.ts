import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message_template: z.string().min(1, 'Message is required'),
  place_ids: z.array(z.string()).min(1, 'At least one place must be selected'),
  frequency: z
    .number()
    .int()
    .positive('Frequency must be a positive number')
    .optional()
    .nullable(),
});

export type CreateCampaignDTO = z.infer<typeof createCampaignSchema>;
