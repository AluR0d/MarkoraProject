import Chip from '@mui/material/Chip';

type Props = {
  role: string;
};

export default function RoleChip({ role }: Props) {
  return <Chip label={role} color="primary" variant="outlined" />;
}
