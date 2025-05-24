import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resetPasswordSchema } from '../../schemas/resetPasswordSchema';
import { ZodError } from 'zod';
import axios from 'axios';
import MinimalHeader from '../molecules/minimalHeader';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

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

      setSnackbar({
        open: true,
        message: t('reset.success'),
        severity: 'success',
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

      setSnackbar({
        open: true,
        message: t('reset.errors.unknown'),
        severity: 'error',
      });
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container maxWidth="sm">
        <Typography mt={8} textAlign="center">
          Token inválido o faltante.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <MinimalHeader />

      <Container maxWidth="sm">
        <Box mt={8}>
          <Paper sx={{ p: 4 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              {t('reset.title')}
            </Typography>
            <TextField
              label={t('reset.password')}
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label={t('reset.confirm_password')}
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? t('reset.loading') : t('reset.submit')}
            </Button>
          </Paper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
