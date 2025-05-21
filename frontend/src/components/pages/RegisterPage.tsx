import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import RegisterForm from '../molecules/RegisterForm';
import { register } from '../../services/authService';
import RedirectLink from '../atoms/RedirectLink';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);

      navigate('/login');
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
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
          <RedirectLink
            question=""
            linkText="¿Ya tienes una cuenta?"
            to="/login"
          />
        </Paper>
      </Box>
    </Container>
  );
}
