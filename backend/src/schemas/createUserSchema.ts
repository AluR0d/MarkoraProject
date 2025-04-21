import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be atleast 6.'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
