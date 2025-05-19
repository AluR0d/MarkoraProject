import { Role } from './Role';

export type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};
