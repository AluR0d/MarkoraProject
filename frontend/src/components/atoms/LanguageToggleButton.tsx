import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

export default function LanguageToggleButton() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <div
      onClick={toggleLanguage}
      className="group flex items-center gap-2 cursor-pointer text-white"
      title="Cambiar idioma"
    >
      <span className="text-lg flex items-center justify-center leading-none">
        <FiGlobe />
      </span>
      <span
        className="text-sm max-w-0 opacity-0 scale-x-0 overflow-hidden 
                   group-hover:max-w-xs group-hover:opacity-100 group-hover:scale-x-100
                   transition-all duration-300 origin-left whitespace-nowrap"
      >
        {currentLang.toUpperCase()}
      </span>
    </div>
  );
}
