import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] font-mono mb-4">
          {t('unauthorized.title')}
        </h1>
        <p className="text-gray-700 font-mono text-base">
          {t('unauthorized.message')}
        </p>
        <p className="text-sm text-gray-500 mt-3 font-mono italic">
          {t('unauthorized.redirect')}
        </p>

        <button
          onClick={() => navigate('/home')}
          className="mt-6 cursor-pointer bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white px-6 py-2 rounded-md font-medium transition-colors font-mono"
        >
          {t('unauthorized.manual')}
        </button>
      </div>
    </div>
  );
}
