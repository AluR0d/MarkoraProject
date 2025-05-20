import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../components/pages/LoginPage';
import RegisterPage from '../components/pages/RegisterPage';
import HomePage from '../components/pages/HomePage';
import PrivateRoute from './PrivateRoute';
import UserPanelPage from '../components/pages/UserPanelPage';
import { AdminRoute } from './AdminRoute';
import AdminPage from '../components/pages/AdminPage';
import Unauthorized from '../components/pages/Unauthorized';
import PlaceDetailPage from '../components/pages/PlaceDetailPage';
import GlobalLayout from '../components/layouts/GlobalLayout';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas con layout y navbar */}
        <Route element={<GlobalLayout />}>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserPanelPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/places/:id"
            element={
              <PrivateRoute>
                <PlaceDetailPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Resto */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
