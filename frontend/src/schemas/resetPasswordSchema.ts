import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'reset.errors.password_too_short')
      .max(64, 'reset.errors.password_too_long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'reset.errors.passwords_do_not_match',
    path: ['confirmPassword'],
  });

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
