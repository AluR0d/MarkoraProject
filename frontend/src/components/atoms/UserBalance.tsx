import { useUser } from '../../context/UserContext';
import { Typography } from '@mui/material';

export function UserBalance() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Typography variant="body1" sx={{ mt: 2 }}>
      💰 Saldo disponible: <strong>{Number(user.balance).toFixed(2)} €</strong>
    </Typography>
  );
}
