import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';
import { TextField } from '@mui/material';
import FormTitle from '../atoms/FormTitle';
import SubmitButton from '../atoms/SubmitButton';
import { registerSchema } from '../../schemas/registerSchema';

type Props = {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
};

export default function RegisterForm({
  onSubmit,
  isLoading = false,
  errorMessage,
  onClearError,
}: Props) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [localErrors, setLocalErrors] = useState<
    Partial<Record<'name' | 'email' | 'password', string>>
  >({});

  const handleChange =
    (field: 'name' | 'email' | 'password') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (onClearError) onClearError();
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      registerSchema.parse(formData);
      setLocalErrors({});
      onSubmit(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<
          Record<'name' | 'email' | 'password', string>
        > = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as 'name' | 'email' | 'password';
          fieldErrors[field] = t(err.message);
        });
        setLocalErrors(fieldErrors);
        if (onClearError) onClearError();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormTitle text={t('register.title')} />

      <TextField
        label={t('register.name')}
        name="name"
        type="text"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange('name')}
        error={!!localErrors.name}
        helperText={localErrors.name}
      />

      <TextField
        label={t('register.email')}
        name="email"
        type="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange('email')}
        error={!!localErrors.email}
        helperText={localErrors.email}
      />

      <TextField
        label={t('register.password')}
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.password}
        onChange={handleChange('password')}
        error={!!localErrors.password}
        helperText={localErrors.password}
      />

      <SubmitButton
        label={isLoading ? t('register.loading') : t('register.submit')}
        disabled={isLoading}
      />

      {errorMessage && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {t(`register.errors.${errorMessage}`)}
        </p>
      )}
    </form>
  );
}
