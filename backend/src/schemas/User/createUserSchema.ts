import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Formato de correo inválido'),
  password: z.string().min(6, 'Credenciales incorrectos'),
  roles: z.array(z.number()).optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
