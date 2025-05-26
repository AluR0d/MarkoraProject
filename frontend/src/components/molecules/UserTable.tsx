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
    <div className="overflow-x-auto border border-gray-200 rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-[var(--color-primary)] text-white">
          <tr>
            <th className="p-3 font-medium">ID</th>
            <th className="p-3 font-medium">{t('admin.table_headers.name')}</th>
            <th className="p-3 font-medium">
              {t('admin.table_headers.email')}
            </th>
            <th className="p-3 font-medium">
              {t('admin.table_headers.roles')}
            </th>
            <th className="p-3 font-medium">
              {t('admin.table_headers.actions')}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={() => onEdit(user)}
              onDelete={() => onDelete(user.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
