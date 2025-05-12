import { z } from 'zod';
import { createOwnerSchema } from './createOwnerSchema';

export const updateOwnerSchema = createOwnerSchema.partial();

export type UpdateOwnerDTO = z.infer<typeof updateOwnerSchema>;
