import { CreateUserDTO } from '../schemas/createUserSchema';

export const mockUserInput = (
  overrides: Partial<CreateUserDTO> = {}
): CreateUserDTO => ({
  name: 'Test-user',
  email: 'test@example.com',
  password: 'password',
  ...overrides,
});
