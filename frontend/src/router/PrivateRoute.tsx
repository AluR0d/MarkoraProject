import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const { user } = useUser();

  // Si no hay usuario, redirige a login
  if (!user) return <Navigate to="/login" />;

  // Si hay usuario, renderiza normalmente
  return <>{children}</>;
}
