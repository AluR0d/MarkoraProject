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
import ResetPasswordPage from '../components/pages/ResetPasswordPage';
import ForgotPasswordPage from '../components/pages/ForgotPasswordPage';
import CreateCampaignPage from '../components/pages/CreateCampaignPage';
import MyCampaignsPage from '../components/pages/MyCampaignsPage';
import PublicRoute from './PublicRoute';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

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

        <Route path="/campaign/create" element={<CreateCampaignPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/my-campaigns" element={<MyCampaignsPage />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
