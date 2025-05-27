import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/notfound.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="notfound-page">
      <div className="notfound-box">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4 text-center">
          {t('notfound.title')}
        </h1>
        <p className="text-center text-[var(--color-dark)] text-lg mb-6">
          {t('notfound.description')}
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-[var(--color-primary)] cursor-pointer text-white font-medium py-2 px-6
                       rounded-md hover:bg-[var(--color-accent)] transition-colors"
          >
            {t('notfound.back_home')}
          </button>
        </div>
      </div>
    </div>
  );
}
