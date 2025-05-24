import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty('forgot.errors.empty_email')
    .email('forgot.errors.invalid_email')
    .max(50, 'forgot.errors.email_too_long'),
});

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
