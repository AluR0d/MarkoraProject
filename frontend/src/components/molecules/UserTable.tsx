import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserRow from '../atoms/UserRow';
import { User } from '../../types/User';

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
};

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('admin.table_headers.id')}</TableCell>
          <TableCell>{t('admin.table_headers.name')}</TableCell>
          <TableCell>{t('admin.table_headers.email')}</TableCell>
          <TableCell>{t('admin.table_headers.roles')}</TableCell>
          <TableCell>{t('admin.table_headers.actions')}</TableCell>
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
