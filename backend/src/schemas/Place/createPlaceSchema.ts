import { z } from 'zod';

export const createPlaceSchema = z.object({
  name: z.string().min(1, 'name is required'),
  address: z.string().min(1, 'address is required'),
  zone: z.string().optional(),
  phone: z.string().max(9, 'phone must be no longer than 9 digits').optional(),
  second_phone: z
    .string()
    .max(9, 'phone must be no longer than 9 digits')
    .optional(),
  email: z.array(z.string().email('Invalid email format')).optional(),
  website: z.string().optional(),
  opening_hours: z.string().optional(),
  rating: z
    .preprocess(
      (val) => Number(val),
      z
        .number()
        .min(0, 'rating must be greater or equal to 0')
        .max(5, 'rating must be lower or equal to 5')
    )
    .optional(),
  user_ratings_total: z.number().optional(),
  types: z.array(z.string()).min(1, 'At least one type is required'),
  active: z.boolean().default(true),
  coords: z
    .object({
      type: z.literal('Point').optional(),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  owner_id: z.number().optional(),
});

export type CreatePlaceDTO = z.infer<typeof createPlaceSchema>;
