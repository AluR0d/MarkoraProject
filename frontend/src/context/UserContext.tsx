import { createContext, useContext, useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/jwt';
import { getUserById, getUserRolesById } from '../services/userService';

type User = {
  id: number;
  name: string;
  email: string;
  balance: number;
  roles: string[];
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const payload = getUserFromToken(token);
    if (!payload?.id) {
      setIsLoading(false);
      return;
    }

    Promise.all([getUserById(payload.id), getUserRolesById(payload.id)])
      .then(([userData, roles]) => {
        console.log('Roles recibidos del backend:', roles);

        setUser({ ...userData, roles });
      })

      .catch((error) => {
        console.error('❌ Error cargando usuario:', error);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
