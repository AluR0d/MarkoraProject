import { z } from 'zod';
import { createPlaceSchema } from './createPlaceSchema';

export const updatePlaceSchema = createPlaceSchema.partial();

export type UpdatePlaceDTO = z.infer<typeof updatePlaceSchema>;
