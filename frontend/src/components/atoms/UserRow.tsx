import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../types/User';
import { useTranslation } from 'react-i18next';

type Props = {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
};

export default function UserRow({ user, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <TableRow hover className="transition-all hover:bg-gray-50">
      <TableCell className="font-mono text-sm text-gray-700">
        {user.id}
      </TableCell>
      <TableCell className="text-[var(--color-dark)] font-medium">
        {user.name}
      </TableCell>
      <TableCell className="text-gray-700">{user.email}</TableCell>
      <TableCell className="text-gray-600">
        {user.roles?.length > 0
          ? user.roles.map((r) => r.name).join(', ')
          : 'Sin roles'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Tooltip title={t('common.edit')}>
            <IconButton
              onClick={onEdit}
              className="cursor-pointer"
              size="small"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton
              onClick={onDelete}
              className="cursor-pointer"
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
