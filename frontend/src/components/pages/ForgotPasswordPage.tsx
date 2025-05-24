import { useState } from 'react';
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
import { ZodError } from 'zod';
import axios from 'axios';
import RedirectLink from '../atoms/RedirectLink';
import { forgotPasswordSchema } from '../../schemas/forgotPasswordSchema';
import { useNavigate } from 'react-router-dom';
import MinimalHeader from '../molecules/minimalHeader';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      forgotPasswordSchema.parse({ email });
      setErrorLocal('');
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0]?.message;
        setErrorLocal(t(firstError || 'forgot.errors.unknown'));
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

      setSnackbar({
        open: true,
        message: t('forgot.success_message'),
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2200);
    } catch (error: any) {
      const elapsed = Date.now() - start;
      if (elapsed < 500) await new Promise((r) => setTimeout(r, 500));

      setSnackbar({
        open: true,
        message: error.response?.data?.message || t('forgot.errors.unknown'),
        severity: 'error',
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

      <Container maxWidth="sm">
        <Box mt={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('forgot.title')}
            </Typography>
            <Typography variant="body2" mb={2}>
              {t('forgot.description')}
            </Typography>
            <TextField
              label={t('forgot.email_label')}
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              error={!!errorLocal}
              helperText={errorLocal}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading
                ? t('forgot.loading') || 'Enviando...'
                : t('forgot.send_button')}
            </Button>

            <Box mt={2}>
              <RedirectLink
                question=""
                linkText={t('forgot.back_to_login')}
                to="/login"
              />
            </Box>
          </Paper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
