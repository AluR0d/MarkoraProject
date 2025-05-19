import { IconButton, TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../types/User';

type Props = {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
};

export default function UserRow({ user, onEdit, onDelete }: Props) {
  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {user.roles?.length > 0
          ? user.roles.map((r) => r.name).join(', ')
          : 'Sin roles'}
      </TableCell>
      <TableCell>
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
