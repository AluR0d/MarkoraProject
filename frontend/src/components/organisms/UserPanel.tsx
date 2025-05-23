import UserInfoSection from '../molecules/UserInfoSection';
import UserRolesSection from '../molecules/UserRolesSection';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = {
  name: string;
  email: string;
  roles: string[];
};

export default function UserPanel({ name, email, roles }: Props) {
  console.log('🧪 Props:', { name, email, roles });

  return (
    <Box mt={6}>
      <Typography variant="h4" gutterBottom>
        Perfil de usuario
      </Typography>
      <UserInfoSection name={name} email={email} />
      <UserRolesSection roles={roles} />
    </Box>
  );
}
