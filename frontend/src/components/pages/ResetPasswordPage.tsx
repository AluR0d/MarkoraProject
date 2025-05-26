import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPasswordSchema } from '../../schemas/resetPasswordSchema';
import { ZodError } from 'zod';
import axios from 'axios';

import MinimalHeader from '../molecules/minimalHeader';
import Notification from '../atoms/Notification';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../../styles/reset.css';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      resetPasswordSchema.parse({ password, confirmPassword });

      const start = Date.now();
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });

      const elapsed = Date.now() - start;
      if (elapsed < 500) await new Promise((r) => setTimeout(r, 500));

      setNotif({
        message: t('reset.success'),
        type: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: { password?: string; confirmPassword?: string } = {};
        error.errors.forEach((e) => {
          const field = e.path[0] as keyof typeof fieldErrors;
          fieldErrors[field] = t(e.message);
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      setNotif({
        message: t('reset.errors.unknown'),
        type: 'error',
      });
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <p className="text-center text-[var(--color-dark)] text-lg font-medium">
          Token inválido o faltante.
        </p>
      </div>
    );
  }

  return (
    <>
      <MinimalHeader />

      <div className="reset-page flex justify-center items-center min-h-screen px-4">
        <div className="reset-box w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-2">
            {t('reset.title')}
          </h2>
          <p className="text-sm text-center text-[var(--color-dark)] mb-6">
            {t('reset.description')}
          </p>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block mb-1 font-medium text-[var(--color-dark)]">
              {t('reset.password')}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 pr-10 border rounded-md bg-white text-sm text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[2.2rem] text-gray-500 hover:text-[var(--color-primary)] cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block mb-1 font-medium text-[var(--color-dark)]">
              {t('reset.confirm_password')}
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 pr-10 border rounded-md bg-white text-sm text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[2.2rem] text-gray-500 hover:text-[var(--color-primary)] cursor-pointer"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-medium py-2 px-4 rounded-md hover:bg-[var(--color-accent)] transition-colors mt-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? t('reset.loading') : t('reset.submit')}
          </button>
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
