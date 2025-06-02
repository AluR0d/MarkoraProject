import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../molecules/RegisterForm';
import { register } from '../../services/authService';
import RedirectLink from '../atoms/RedirectLink';
import { useTranslation } from 'react-i18next';
import MinimalHeader from '../molecules/minimalHeader';
import Notification from '../atoms/Notification';

import '../../styles/register.css';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [notif, setNotif] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
      navigate('/login', { state: { registered: true } });
    } catch (error: any) {
      setNotif({
        message: t('USER_ALREADY_EXISTS'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearError = () => {
    if (notif?.type === 'error') setNotif(null);
  };

  return (
    <>
      <MinimalHeader />
      <div className="register-page flex justify-center items-center min-h-screen px-4">
        <div className="register-box w-full max-w-md p-8">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            errorMessage={notif?.type === 'error' ? notif.message : ''}
            onClearError={handleClearError}
          />

          <div className="flex justify-center mt-4">
            <RedirectLink
              question=""
              linkText={t('register.redirects.already_have_account')}
              to="/login"
              className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
            />
          </div>
        </div>
      </div>

      {notif && (
        <Notification
          message={t('register.errors.USER_ALREADY_EXISTS')}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
    </>
  );
}
