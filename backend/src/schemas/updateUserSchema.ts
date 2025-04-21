import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(6, 'Password must be atleast 6.').optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
