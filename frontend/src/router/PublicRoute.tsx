import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../components/atoms/Loader';

type Props = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loader />;

  if (user) return <Navigate to="/home" />;

  return <>{children}</>;
}
