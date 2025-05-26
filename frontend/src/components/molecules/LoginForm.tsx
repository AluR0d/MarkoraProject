import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loginSchema } from '../../schemas/loginSchema';
import { ZodError } from 'zod';

import { FiEye, FiEyeOff } from 'react-icons/fi';

import SubmitButton from '../atoms/SubmitButton';
import FormTitle from '../atoms/FormTitle';

type Props = {
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
};

export default function LoginForm({
  onSubmit,
  isLoading = false,
  errorMessage,
  onClearError,
}: Props) {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<'email' | 'password', string>>
  >({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loginSchema.parse({ email, password });
      setLocalErrors({});
      onSubmit({ email, password });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<'email' | 'password', string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as 'email' | 'password';
          fieldErrors[field] = t(err.message);
        });
        setLocalErrors(fieldErrors);
        if (onClearError) onClearError();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FormTitle text={t('login.title')} />

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-[var(--color-dark)]">
          {t('login.email')}
        </label>
        <input
          type="email"
          className={`w-full px-3 py-2 border rounded-md bg-white text-sm text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            localErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {localErrors.email && (
          <p className="text-sm text-red-500 mt-1">{localErrors.email}</p>
        )}
      </div>

      {/* Password con ícono 👁️ */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium text-[var(--color-dark)]">
          {t('login.password')}
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full px-3 py-2 pr-10 border rounded-md bg-white text-sm text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
            localErrors.password ? 'border-red-500' : 'border-gray-300'
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
        {localErrors.password && (
          <p className="text-sm text-red-500 mt-1">{localErrors.password}</p>
        )}
      </div>

      {/* Botón enviar */}
      <SubmitButton
        label={isLoading ? t('login.loading') : t('login.submit')}
        disabled={isLoading}
      />

      {/* Error general */}
      {errorMessage && (
        <p className="text-center text-red-600 mt-4 font-medium">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
