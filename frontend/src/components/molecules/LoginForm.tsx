import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SubmitButton from '../atoms/SubmitButton';
import FormTitle from '../atoms/FormTitle';
import { loginSchema } from '../../schemas/loginSchema';
import { ZodError } from 'zod';
import { TextField } from '@mui/material';

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
    <form onSubmit={handleSubmit}>
      <FormTitle text={t('login.title')} />

      <TextField
        label={t('login.email')}
        name="email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!localErrors.email}
        helperText={localErrors.email}
      />

      <TextField
        label={t('login.password')}
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!localErrors.password}
        helperText={localErrors.password}
      />

      <SubmitButton
        label={isLoading ? t('login.loading') : t('login.submit')}
        disabled={isLoading}
      />

      {errorMessage && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
