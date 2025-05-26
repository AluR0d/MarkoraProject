import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordSchema } from '../../schemas/forgotPasswordSchema';
import RedirectLink from '../atoms/RedirectLink';
import MinimalHeader from '../molecules/minimalHeader';
import Notification from '../atoms/Notification';

import '../../styles/forgot.css';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      forgotPasswordSchema.parse({ email });
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0]?.message;
        setNotif({
          message: t(firstError || 'forgot.errors.unknown'),
          type: 'error',
        });
      }
      setLoading(false);
      return;
    }

    const start = Date.now();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email,
      });

      const elapsed = Date.now() - start;
      if (elapsed < 500) await new Promise((r) => setTimeout(r, 500));

      setNotif({
        message: t('forgot.success_message'),
        type: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2200);
    } catch (error: any) {
      const elapsed = Date.now() - start;
      if (elapsed < 500) await new Promise((r) => setTimeout(r, 500));

      setNotif({
        message: error.response?.data?.message || t('forgot.errors.unknown'),
        type: 'error',
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MinimalHeader />
      <div className="forgot-page flex justify-center items-center min-h-screen px-4">
        <div className="forgot-box w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-2">
            {t('forgot.title')}
          </h2>
          <p className="text-sm text-center text-[var(--color-dark)] mb-6">
            {t('forgot.description')}
          </p>

          <label className="block mb-1 font-medium text-[var(--color-dark)]">
            {t('forgot.email_label')}
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md bg-white text-sm
            text-[var(--color-dark)] focus:outline-none focus:ring-2
            focus:ring-[var(--color-primary)] border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[var(--color-primary)]
            text-white font-medium py-2 px-4 rounded-md hover:bg-[var(--color-accent)]
            transition-colors mt-4 disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? t('forgot.loading') || 'Enviando...'
              : t('forgot.send_button')}
          </button>

          <div className="flex justify-center mt-6">
            <RedirectLink
              question=""
              linkText={t('forgot.back_to_login')}
              to="/login"
              className="text-sm text-[var(--color-primary)]
              hover:text-[var(--color-accent)] transition-colors"
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
