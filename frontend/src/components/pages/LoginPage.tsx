import { useState, useEffect } from 'react';
import LoginForm from '../molecules/LoginForm';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { login } from '../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getUserFromToken } from '../../utils/jwt';
import RedirectLink from '../atoms/RedirectLink';
import { getUserById, getUserRolesById } from '../../services/userService';
import { useTranslation } from 'react-i18next';
import MinimalHeader from '../molecules/minimalHeader';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    if (location.state?.registered) {
      setShowSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage('');
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
      setErrorMessage(error.message);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MinimalHeader />
      <Container maxWidth="sm">
        <Box mt={8}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              errorMessage=""
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
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
            </Box>
          </Paper>
        </Box>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            {t('login.success_registered')}
          </Alert>
        </Snackbar>

        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
            {t(errorMessage)}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
