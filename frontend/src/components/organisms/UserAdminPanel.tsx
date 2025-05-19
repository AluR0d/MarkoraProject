import { useEffect, useState } from 'react';
import { TableContainer, Paper } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import UserFormModal from '../molecules/UserFormModal';
import UserTable from '../molecules/UserTable';
import PanelHeader from '../molecules/PanelHeader';
import { User } from '../../types/User';
import { Role } from '../../types/Role';

export default function UserAdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false); // para crear
  const [editUser, setEditUser] = useState<
    (User & { roleIds: number[] }) | null
  >(null);

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

      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: `Se ha creado el usuario ${newUser.name}`,
      });
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

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message || 'No se pudo crear el usuario. Intenta de nuevo.',
      });
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

      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: `Se ha actualizado correctamente.`,
      });
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

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message || 'No se pudo actualizar el usuario.',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers((prev) => prev.filter((u) => u.id !== userId));

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado correctamente.',
        });
      } catch (error: any) {
        console.error('Error al eliminar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el usuario.',
        });
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <PanelHeader title="Lista de usuarios" onCreate={() => setOpen(true)} />

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
