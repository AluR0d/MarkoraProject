import { z } from 'zod';

export const createOwnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type CreateOwnerDTO = z.infer<typeof createOwnerSchema>;
