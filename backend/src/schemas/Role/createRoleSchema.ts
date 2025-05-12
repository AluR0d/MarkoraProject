import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
