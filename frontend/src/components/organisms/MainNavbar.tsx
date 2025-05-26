import { FiHome, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { logout } from '../../services/authService';
import LanguageSelector from '../atoms/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

import '../../styles/navbar.css';

export default function MainNavbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const hasAdminRole = user?.roles?.includes('Administrator');

  return (
    <header className="main-navbar">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Mensaje de bienvenida */}
        <div className="welcome-text">
          {t('navbar.welcome')}
          {user ? `, ${user.name}` : ''}
        </div>

        {/* Iconos de navegación */}
        <nav className="flex items-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="nav-button"
            title={t('navbar.home')}
          >
            <FiHome />
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="nav-button"
            title={t('navbar.profile')}
          >
            <FiUser />
          </button>

          {hasAdminRole && (
            <button
              onClick={() => navigate('/admin')}
              className="nav-button"
              title={t('navbar.admin')}
            >
              <FiSettings />
            </button>
          )}

          <button
            onClick={handleLogout}
            className="nav-button"
            title={t('navbar.logout')}
          >
            <FiLogOut />
          </button>

          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}
