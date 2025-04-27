import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });

      const { token } = response.data; // Asumimos que el backend devuelve { token: '...' }

      // Guardamos el token en localStorage
      localStorage.setItem('token', token);

      // Redirigimos al usuario a la página principal
      navigate('/');
      // } catch (err: any) {
      //   console.error(err);
      //   if (err.response && err.response.data && err.response.data.message) {
      //     setError(err.response.data.message);
      //   } else {
      //     setError('Error al iniciar sesión.');
      //   }
      // }
    } catch (err: any) {
      console.error('Error real:', err.response?.data || err.message || err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al iniciar sesión.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
};

export default LoginForm;
