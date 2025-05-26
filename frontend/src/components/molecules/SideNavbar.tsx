import { FiHome, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { logout } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '../atoms/LanguageToggleButton';
import { JSX } from 'react';

type NavItemProps = {
  icon: JSX.Element;
  label: string;
  to?: string;
  onClick?: () => void;
};

function NavItem({ icon, label, to, onClick }: NavItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className="w-12 h-12 flex items-center justify-center rounded-full text-white
               hover:bg-[var(--color-accent)] transition-colors duration-200"
      title={label}
    >
      <span className="text-xl leading-none">{icon}</span>
    </button>
  );
}

export default function SideNavbar() {
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
      className="absolute left-6 mt-6 z-50 transition-all duration-200 ease-in-out
                    bg-[var(--color-primary)]/80 backdrop-blur-lg border border-white/10
                    rounded-xl p-3 flex flex-col gap-3 shadow-xl w-16"
    >
      <NavItem icon={<FiHome />} label={t('navbar.home')} to="/home" />
      <NavItem icon={<FiUser />} label={t('navbar.profile')} to="/profile" />
      {hasAdminRole && (
        <NavItem icon={<FiSettings />} label={t('navbar.admin')} to="/admin" />
      )}
      <NavItem
        icon={<FiLogOut />}
        label={t('navbar.logout')}
        onClick={handleLogout}
      />
      <NavItem icon={<LanguageToggleButton />} label="Idioma" />
    </div>
  );
}
