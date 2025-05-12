import { z } from 'zod';
import { createRoleSchema } from './createRoleSchema';

export const updateRoleSchema = createRoleSchema.partial();

export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
