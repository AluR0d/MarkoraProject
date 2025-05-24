import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('register.errors.empty_name')
    .max(50, 'register.errors.name_too_long'),

  email: z
    .string()
    .trim()
    .nonempty('register.errors.empty_email')
    .email('register.errors.invalid_email')
    .max(50, 'register.errors.email_too_long'),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
