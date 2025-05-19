import { createContext, useContext, useState } from 'react';
import { getUserFromToken } from '../utils/jwt';

type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    return token ? getUserFromToken(token) : null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
