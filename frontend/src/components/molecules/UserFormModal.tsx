import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';

export type Role = {
  id: number;
  name: string;
};

export type UserFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    roles: number[];
  }) => void;
  initialData?: {
    name: string;
    email: string;
    password?: string;
    roles: number[];
  };
  roles: Role[];
  isEditing?: boolean;
};

export default function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  roles,
  isEditing = false,
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: [] as number[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '',
        roles: initialData.roles,
      });
    } else {
      setFormData({ name: '', email: '', password: '', roles: [] });
    }
  }, [initialData, open]);

  const isValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.roles.length > 0;

  const handleSubmit = () => {
    onSubmit({
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      roles: formData.roles,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? 'Editar usuario' : 'Crear nuevo usuario'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre"
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label={isEditing ? 'Nueva contraseña' : 'Contraseña'}
          type="password"
          margin="normal"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="roles-label">Roles</InputLabel>
          <Select
            labelId="roles-label"
            id="roles-select"
            label="Roles"
            multiple
            value={formData.roles}
            onChange={(e) =>
              setFormData({
                ...formData,
                roles:
                  typeof e.target.value === 'string'
                    ? e.target.value.split(',').map(Number)
                    : e.target.value,
              })
            }
            renderValue={(selected) =>
              roles
                .filter((r) => selected.includes(r.id))
                .map((r) => r.name)
                .join(', ')
            }
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          {isEditing ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
