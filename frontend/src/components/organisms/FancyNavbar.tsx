import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { logout } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '../atoms/LanguageToggleButton';
import useScrollPosition from '../../hooks/useScrollPosition';
import { JSX, useEffect, useState } from 'react';

type NavItemProps = {
  icon: JSX.Element;
  label: string;
  to?: string;
  onClick?: () => void;
  mode?: 'top' | 'overlay' | 'sidebar';
};

function NavItem({ icon, label, to, onClick, mode = 'top' }: NavItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  const baseStyles =
    'group cursor-pointer text-white transition-colors duration-300 hover:bg-[var(--color-accent)] rounded-full';

  const layoutStyles =
    mode === 'overlay'
      ? 'flex gap-2 items-center px-4 py-3 text-lg w-full justify-center'
      : mode === 'sidebar'
        ? 'flex flex-col items-center justify-center w-12 h-12'
        : 'flex items-center gap-2 px-3 py-2';

  return (
    <div onClick={handleClick} className={`${baseStyles} ${layoutStyles}`}>
      <span className="text-xl flex items-center justify-center">{icon}</span>
      {mode === 'top' && (
        <span
          className="text-sm max-w-0 opacity-0 scale-x-0 overflow-hidden 
                       group-hover:max-w-xs group-hover:opacity-100 group-hover:scale-x-100
                       transition-all duration-300 origin-left whitespace-nowrap"
        >
          {label}
        </span>
      )}
      {mode === 'overlay' && <span>{label}</span>}
    </div>
  );
}

export default function FancyNavbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isScrolled = useScrollPosition(30);

  const [showTop, setShowTop] = useState(true);
  const [showSide, setShowSide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const hasAdminRole = user?.roles?.includes('Administrator');
  const mode = mobileMenuOpen ? 'overlay' : showSide ? 'sidebar' : 'top';

  const navItems = (
    <>
      <NavItem
        icon={<FiHome />}
        label={t('navbar.home')}
        to="/home"
        mode={mode}
      />
      <NavItem
        icon={<FiUser />}
        label={t('navbar.profile')}
        to="/profile"
        mode={mode}
      />
      {hasAdminRole && (
        <NavItem
          icon={<FiSettings />}
          label={t('navbar.admin')}
          to="/admin"
          mode={mode}
        />
      )}
      <NavItem
        icon={<FiLogOut />}
        label={t('navbar.logout')}
        onClick={handleLogout}
        mode={mode}
      />
      <div
        className={`text-white transition-colors duration-300 hover:bg-[var(--color-accent)] rounded-full
            ${
              mode === 'overlay'
                ? 'flex gap-2 items-center px-4 py-3 text-lg w-full justify-center'
                : mode === 'sidebar'
                  ? 'w-12 h-12 flex items-center justify-center'
                  : 'flex items-center gap-2 px-3 py-2'
            }`}
      >
        <LanguageToggleButton />
      </div>
    </>
  );

  useEffect(() => {
    if (window.innerWidth < 768) return;

    let topTimeout: ReturnType<typeof setTimeout>;
    let sideTimeout: ReturnType<typeof setTimeout>;

    if (isScrolled) {
      topTimeout = setTimeout(() => setShowTop(false), 100);
      sideTimeout = setTimeout(() => setShowSide(true), 100);
    } else {
      sideTimeout = setTimeout(() => setShowSide(false), 100);
      topTimeout = setTimeout(() => setShowTop(true), 100);
    }

    return () => {
      clearTimeout(topTimeout);
      clearTimeout(sideTimeout);
    };
  }, [isScrolled]);

  return (
    <>
      {/* TOP NAVBAR */}
      <div
        className={`fixed top-0 left-0 w-full px-4 md:px-6 py-3 z-50 transition-all duration-200 ease-in-out
            ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}
            bg-[var(--color-primary)]/70 backdrop-blur-lg border-b border-white/10
            flex items-center justify-between shadow-md`}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-2 text-white text-lg font-semibold">
          <img
            src="src/assets/fHEq2Y01.svg"
            alt="Markora logo"
            className="w-10 h-10"
          />
          <span>Markora</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-4">{navItems}</div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden text-white text-2xl p-2"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* SIDEBAR ONLY for desktop */}
      <div
        className={`hidden md:flex fixed top-1/2 left-4 z-50 transition-all duration-200 ease-in-out
            ${showSide ? 'opacity-100 -translate-y-1/2 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}
            bg-[var(--color-primary)]/80 backdrop-blur-lg border border-white/10
            rounded-xl p-3 flex-col items-center gap-3 shadow-xl w-16`}
      >
        {navItems}
      </div>

      {/* MOBILE OVERLAY MENU */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--color-primary)]/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 px-8"
          onClick={() => setMobileMenuOpen(false)}
        >
          {navItems}
        </div>
      )}
    </>
  );
}
