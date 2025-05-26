import { FiHome, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { logout } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '../atoms/LanguageToggleButton';

export default function TopNavbar() {
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
    <div
      className="fixed top-0 left-0 w-full px-6 py-3 z-50 transition-all duration-200 ease-in-out
                    bg-[var(--color-primary)]/70 backdrop-blur-lg border-b border-white/10
                    flex justify-center gap-4 shadow-md"
    >
      <button onClick={() => navigate('/home')} title={t('navbar.home')}>
        <FiHome className="text-xl text-white" />
      </button>
      <button onClick={() => navigate('/profile')} title={t('navbar.profile')}>
        <FiUser className="text-xl text-white" />
      </button>
      {hasAdminRole && (
        <button onClick={() => navigate('/admin')} title={t('navbar.admin')}>
          <FiSettings className="text-xl text-white" />
        </button>
      )}
      <button onClick={handleLogout} title={t('navbar.logout')}>
        <FiLogOut className="text-xl text-white" />
      </button>
      <LanguageToggleButton />
    </div>
  );
}
