import Container from '@mui/material/Container';
import { useUser } from '../../context/UserContext';
import UserPanel from '../organisms/UserPanel';

export default function UserPanelPage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <UserPanel name={user.name} email={user.email} roles={user.roles} />
    </Container>
  );
}
