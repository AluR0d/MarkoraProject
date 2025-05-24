import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { logout } from '../../services/authService';
import { Box } from '@mui/material';
import LanguageSelector from '../atoms/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function MainNavbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const hasAdminRole = user?.roles?.includes('Administrator');

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {t('navbar.welcome')}
          {user ? `, ${user.name}` : ''}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/home')}>
            {t('navbar.home')}
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            {t('navbar.profile')}
          </Button>
          {hasAdminRole && (
            <Button color="inherit" onClick={() => navigate('/admin')}>
              {t('navbar.admin')}
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>
            {t('navbar.logout')}
          </Button>
          <LanguageSelector />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
