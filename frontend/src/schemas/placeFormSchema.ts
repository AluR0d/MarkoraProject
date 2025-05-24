import { z } from 'zod';

export const placeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'admin.places.errors.required')
    .max(50, 'admin.places.errors.max_50'),

  zone: z
    .string()
    .trim()
    .min(1, 'admin.places.errors.required')
    .max(50, 'admin.places.errors.max_50'),

  address: z
    .string()
    .trim()
    .min(1, 'admin.places.errors.required')
    .max(50, 'admin.places.errors.max_50'),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{9}$/.test(val), {
      message: 'admin.places.errors.invalid_phone',
    }),

  second_phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{9}$/.test(val), {
      message: 'admin.places.errors.invalid_phone',
    }),

  email: z
    .array(z.string().email('admin.places.errors.invalid_email'))
    .optional(),

  website: z.string().max(50, 'admin.places.errors.max_50').optional(),

  opening_hours: z.string().max(20, 'admin.places.errors.max_20').optional(),

  rating: z
    .number()
    .min(0, 'admin.places.errors.rating_range')
    .max(5, 'admin.places.errors.rating_range'),

  user_ratings_total: z
    .number()
    .int()
    .min(0, 'admin.places.errors.rating_total_min')
    .max(100000, 'admin.places.errors.rating_total_max')
    .optional(),

  types: z
    .array(z.string().trim().min(1))
    .min(1, 'admin.places.errors.types_required'),

  coords: z
    .object({
      type: z.literal('Point'),
      coordinates: z.array(z.number()).refine((arr) => arr.length === 2, {
        message: 'admin.places.errors.invalid_coords',
      }),
    })
    .refine(
      (obj) =>
        Array.isArray(obj.coordinates) &&
        obj.coordinates.length === 2 &&
        obj.coordinates.every((v) => typeof v === 'number' && !isNaN(v)),
      {
        message: 'admin.places.errors.invalid_coords',
      }
    ),

  active: z.boolean(),
});
