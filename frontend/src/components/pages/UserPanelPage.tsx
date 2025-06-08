import { useUser } from '../../context/UserContext';
import UserEditForm from '../molecules/UserEditForm';
import { UserBalance } from '../atoms/UserBalance';
import '../../styles/profile.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function UserPanelPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!user) return null;

  const isAdmin =
    Array.isArray(user.roles) && user.roles.includes('Administrator');

  return (
    <div className="profile-page">
      <div className="profile-box">
        <UserEditForm />
        <UserBalance />

        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/profile/reports')}
              className="bg-[var(--color-primary)] cursor-pointer text-white font-medium py-2 px-6
                         rounded-md hover:bg-[var(--color-accent)] transition-colors"
            >
              {t('profile.viewReportHistory')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
