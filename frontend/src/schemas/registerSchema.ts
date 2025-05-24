import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .nonempty('register.errors.empty_name')
    .max(50, 'register.errors.name_too_long'),

  email: z
    .string()
    .nonempty('register.errors.empty_email')
    .email('register.errors.invalid_email')
    .max(50, 'register.errors.email_too_long'),

  password: z
    .string()
    .nonempty('register.errors.empty_password')
    .min(6, 'register.errors.password_too_short')
    .max(64, 'register.errors.password_too_long'),
});
