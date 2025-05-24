import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('login.errors.empty_email')
    .email('login.errors.invalid_email'),
  password: z.string().nonempty('login.errors.empty_password'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
