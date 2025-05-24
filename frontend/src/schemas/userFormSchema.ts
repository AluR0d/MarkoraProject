import { z } from 'zod';

export const baseUserSchema = z.object({
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

  roles: z.array(z.number()).nonempty('admin.errors.empty_roles'),
});

export const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .trim()
    .nonempty('register.errors.empty_password')
    .min(6, 'register.errors.password_too_short')
    .max(64, 'register.errors.password_too_long'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'register.errors.empty_name')
    .max(50, 'register.errors.name_too_long')
    .trim(),

  email: z
    .string()
    .min(1, 'register.errors.empty_email')
    .max(50, 'register.errors.email_too_long')
    .email('register.errors.invalid_email')
    .trim(),

  password: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val === '' || (val.length >= 6 && val.length <= 64), {
      message: 'user.errors.password_invalid_range',
    })
    .optional(),

  roles: z.array(z.number()).min(1, 'admin.errors.empty_roles'),
});
