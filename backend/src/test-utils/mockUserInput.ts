import { CreateUserDTO } from '../schemas/User/createUserSchema';

export const mockUserInput = (
  overrides: Partial<CreateUserDTO> = {}
): CreateUserDTO => ({
  name: 'Test-user',
  email: 'test@example.com',
  password: 'password',
  ...overrides,
});
