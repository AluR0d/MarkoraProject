import { useUser } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';

export function UserBalance() {
  const { user } = useUser();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <p className="mt-4 text-sm text-[var(--color-dark)] text-center">
      {t('profile.balance')}:{' '}
      <strong>{Number(user.balance).toFixed(2)} €</strong>
    </p>
  );
}
