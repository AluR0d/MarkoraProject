import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/jwt';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdmin()) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
