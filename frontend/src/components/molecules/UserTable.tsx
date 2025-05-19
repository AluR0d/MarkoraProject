import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import UserRow from '../atoms/UserRow';
import { User } from '../../types/User';

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
};

export default function UserTable({ users, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Roles</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onEdit={() =>
              onEdit({
                ...user,
                roleIds: user.roles.map((r) => r.id),
              } as any)
            }
            onDelete={() => onDelete(user.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
}
