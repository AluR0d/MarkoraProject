import { useUser } from '../../context/UserContext';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function UserBalance() {
  const { user } = useUser();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Typography variant="body1" sx={{ mt: 2 }}>
      {t('profile.balance')}:{' '}
      <strong>{Number(user.balance).toFixed(2)} €</strong>
    </Typography>
  );
}
