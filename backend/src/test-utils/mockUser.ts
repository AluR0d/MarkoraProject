import { User } from '../models/User';

export const createMockUser = (overrides: Partial<User> = {}) =>
  ({
    id: 1,
    name: 'Mock User',
    email: 'mock@example.com',
    password: 'securePassword',
    createdAt: null,
    updatedAt: null,
    ...overrides,
  }) as User;
