import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import RegisterForm from '../molecules/RegisterForm';
import { register } from '../../services/authService';
import RedirectLink from '../atoms/RedirectLink';
import { useTranslation } from 'react-i18next';
import MinimalHeader from '../molecules/minimalHeader';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);

      navigate('/login', { state: { registered: true } });
    } catch (error: any) {
      setErrorMessage(error.message);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearError = () => {
    if (errorMessage) setErrorMessage('');
  };

  return (
    <>
      <MinimalHeader />
      <Container maxWidth="sm">
        <Box mt={8}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              errorMessage={''}
              onClearError={handleClearError}
            />
            <RedirectLink
              question=""
              linkText={t('register.redirects.already_have_account')}
              to="/login"
            />
          </Paper>
        </Box>

        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
            {t(`register.errors.${errorMessage}`)}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
