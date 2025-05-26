import { useState, useEffect } from 'react';
import { login } from '../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getUserFromToken } from '../../utils/jwt';
import { getUserById, getUserRolesById } from '../../services/userService';
import { useTranslation } from 'react-i18next';

import LoginForm from '../molecules/LoginForm';
import MinimalHeader from '../molecules/minimalHeader';
import RedirectLink from '../atoms/RedirectLink';
import Notification from '../atoms/Notification';

import '../../styles/login.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [notif, setNotif] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    if (location.state?.registered) {
      setNotif({ message: t('login.success_registered'), type: 'success' });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, t]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);

      const token = localStorage.getItem('token');
      const payload = token ? getUserFromToken(token) : null;
      if (!payload?.id) throw new Error('Token inválido');

      const [userData, roles] = await Promise.all([
        getUserById(payload.id),
        getUserRolesById(payload.id),
      ]);

      setUser({ ...userData, roles });
      navigate('/home');
    } catch (error: any) {
      setNotif({
        message: t('login.errors.invalid_credentials'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MinimalHeader />
      <div className="login-page flex justify-center items-center min-h-screen px-4">
        <div className="login-box w-full max-w-md p-6">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            errorMessage=""
          />

          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-12 mt-4 text-sm text-center">
            <RedirectLink
              question=""
              linkText={t('login.redirects.no_account')}
              to="/register"
            />
            <RedirectLink
              question=""
              linkText={t('login.redirects.forgot_password')}
              to="/forgot-password"
            />
          </div>
        </div>
      </div>

      {notif && (
        <Notification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
    </>
  );
}
