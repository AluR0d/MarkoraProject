import PrimaryButton from '../atoms/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/home.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <div className="home-box z-30">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[var(--color-primary)] mb-4">
          {t('home.welcome_title')}
        </h1>
        <p className="text-center text-[var(--color-dark)] text-sm sm:text-base mb-8">
          {t('home.welcome_description')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <PrimaryButton
            label={t('campaign.create_new')}
            onClick={() => navigate('/campaign/create')}
          />
          <PrimaryButton
            label={t('home.my_campaigns')}
            onClick={() => navigate('/my-campaigns')}
          />
        </div>

        <p className="text-center text-gray-500 italic mt-8 text-sm">
          {t('home.motivational_quote')}
        </p>
      </div>
    </div>
  );
}
