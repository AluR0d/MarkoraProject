import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { logout } from '../../services/authService';

export default function MainNavbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bienvenido{user ? `, ${user.name}` : ''}
        </Typography>
        <Button color="inherit">Inicio</Button>
        <Button color="inherit" onClick={() => navigate('/profile')}>
          Perfil
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}
