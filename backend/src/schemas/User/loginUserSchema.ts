import { z } from 'zod';
import { createUserSchema } from './createUserSchema';

export const loginUserSchema = createUserSchema
  .pick({ email: true, password: true })
  .strict();

export type LoginUserDTO = z.infer<typeof loginUserSchema>;
