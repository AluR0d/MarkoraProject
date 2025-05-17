import { useState } from 'react';
import LoginForm from '../molecules/LoginForm';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // para redirigir al usuario

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(data.email, data.password);

      navigate('/home');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </Paper>
      </Box>
    </Container>
  );
}
