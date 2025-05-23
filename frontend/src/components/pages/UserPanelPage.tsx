import Container from '@mui/material/Container';
import { useUser } from '../../context/UserContext';
import UserEditForm from '../molecules/UserEditForm';
import { UserBalance } from '../atoms/UserBalance';

export default function UserPanelPage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <UserEditForm />
      <UserBalance />
    </Container>
  );
}
