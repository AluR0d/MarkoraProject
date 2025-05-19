import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RoleChip from '../atoms/RoleChip';

type Props = {
  roles: string[];
};

export default function UserRolesSection({ roles }: Props) {
  return (
    <>
      <Typography variant="body1" mt={2}>
        <strong>Roles:</strong>
      </Typography>
      <Stack direction="row" spacing={1} mt={1}>
        {roles.map((role) => (
          <RoleChip key={role} role={role} />
        ))}
      </Stack>
    </>
  );
}
