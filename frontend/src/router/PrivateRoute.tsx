import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../components/atoms/Loader';

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const { user, isLoading } = useUser();

  // Mientras se está cargando el usuario, muestra un loader
  if (isLoading) return <Loader />;

  // Si no hay usuario, redirige a login
  if (!user) return <Navigate to="/login" />;

  // Si hay usuario, renderiza normalmente
  return <>{children}</>;
}
