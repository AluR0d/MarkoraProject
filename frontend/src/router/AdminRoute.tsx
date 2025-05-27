import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../components/atoms/Loader';

type Props = {
  children: React.ReactNode;
};

export const AdminRoute = ({ children }: Props) => {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loader />;

  // Primero, si no hay usuario, no está autenticado → login
  if (!user) return <Navigate to="/login" />;

  // Si hay usuario pero no es admin → unauthorized
  const isAdmin = user.roles?.includes('Administrator');
  if (!isAdmin) return <Navigate to="/unauthorized" />;

  // Si es admin, renderiza children
  return <>{children}</>;
};
