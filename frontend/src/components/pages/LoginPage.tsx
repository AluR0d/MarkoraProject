import { useState } from 'react';
import LoginForm from '../molecules/LoginForm';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getUserFromToken } from '../../utils/jwt';
import RedirectLink from '../atoms/RedirectLink';
import { getUserById, getUserRolesById } from '../../services/userService';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(data.email, data.password); // guarda el token en localStorage

      const token = localStorage.getItem('token');
      const payload = token ? getUserFromToken(token) : null;

      if (!payload?.id) throw new Error('Token inválido');

      const [userData, roles] = await Promise.all([
        getUserById(payload.id),
        getUserRolesById(payload.id),
      ]);

      setUser({ ...userData, roles }); // ✅ user completo y válido
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

          <Box display="flex" justifyContent="space-between" mt={2}>
            <RedirectLink
              question=""
              linkText="¿No tienes una cuenta?"
              to="/register"
            />
            <RedirectLink
              question=""
              linkText="¿Has olvidado tu contraseña?"
              to="/forgot-password"
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
