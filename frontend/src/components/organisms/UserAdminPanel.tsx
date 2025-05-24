import { useEffect, useState } from 'react';
import { TableContainer, Paper } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import NotificationSnackbar from '../atoms/NotificationSnackbar';
import ConfirmDialog from '../atoms/ConfirmDialog';
import UserFormModal from '../molecules/UserFormModal';
import UserTable from '../molecules/UserTable';
import PanelHeader from '../molecules/PanelHeader';
import { User } from '../../types/User';
import { Role } from '../../types/Role';

export default function UserAdminPanel() {
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<
    (User & { roleIds: number[] }) | null
  >(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId?: number;
  }>({
    open: false,
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios', error);
      showSnackbar(t('admin.errors.load_users_failed'), 'error');
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/roles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles', error);
      showSnackbar(t('admin.errors.load_roles_failed'), 'error');
    }
  };

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    password?: string;
    roles: number[];
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newUser = response.data;
      setUsers((prev) => [...prev, newUser]);
      setOpen(false);
    } catch (error: any) {
      console.error('Error al crear el usuario', error);
      setOpen(false);

      const zodError = error.response?.data?.errors;
      let message = '';

      if (zodError) {
        const firstKey = Object.keys(zodError)[0];
        const firstMessage = zodError[firstKey][0];
        message = firstMessage;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      showSnackbar(message || t('admin.errors.create_failed'), 'error');
    }
  };

  const handleUpdateUser = async (data: {
    name: string;
    email: string;
    password?: string;
    roles: number[];
  }) => {
    if (!editUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${editUser.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = response.data;
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setEditUser(null);
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      setEditUser(null);

      const zodError = error.response?.data?.errors;
      let message = '';

      if (zodError) {
        const firstKey = Object.keys(zodError)[0];
        const firstMessage = zodError[firstKey][0];
        message = firstMessage;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      showSnackbar(message || t('admin.errors.update_failed'), 'error');
    }
  };

  const handleDeleteUser = (userId: number) => {
    setConfirmDialog({ open: true, userId });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.userId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${confirmDialog.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prev) => prev.filter((u) => u.id !== confirmDialog.userId));
      showSnackbar(t('admin.user_deleted_successfully'), 'success');
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      showSnackbar(t('admin.errors.delete_failed'), 'error');
    } finally {
      setConfirmDialog({ open: false });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <ConfirmDialog
        open={confirmDialog.open}
        title={t('admin.confirm_delete.title')}
        message={t('admin.confirm_delete.message')}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ open: false })}
      />

      <NotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <PanelHeader title={t('admin.tabs.users')} onCreate={() => setOpen(true)}>
        {t('admin.create_user')}
      </PanelHeader>

      <UserFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateUser}
        roles={roles}
      />

      <UserFormModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        onSubmit={handleUpdateUser}
        roles={roles}
        isEditing
        initialData={
          editUser
            ? {
                name: editUser.name,
                email: editUser.email,
                roles: editUser.roleIds,
              }
            : undefined
        }
      />

      <UserTable
        users={users}
        onEdit={(user) =>
          setEditUser({
            ...user,
            roleIds: user.roles.map((r) => r.id),
          })
        }
        onDelete={handleDeleteUser}
      />
    </TableContainer>
  );
}
