import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

export function getUserFromToken(token: string) {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    console.log('Token decodificado:', decoded);

    const { id, name, email, roles } = decoded;

    return {
      id,
      name,
      email,
      roles,
    };
  } catch (error) {
    console.error(' Error al decodificar token:', error);
    return null;
  }
}

export function isAdmin(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const user = getUserFromToken(token);
  if (!user) return false;

  return user.roles.includes('Administrator');
}
