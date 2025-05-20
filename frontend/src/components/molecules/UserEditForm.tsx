import { useState } from 'react';
import {
  TextField,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import UserRolesSection from '../molecules/UserRolesSection';

export default function UserEditForm() {
  const { user } = useUser();
  const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user?.id}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: 'Datos actualizados correctamente',
        severity: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Box mt={6}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Perfil de usuario</Typography>
        <IconButton
          onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
          color="primary"
        >
          {isEditing ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      <Box mt={3}>
        <Collapse in={!isEditing} timeout={300} unmountOnExit>
          <Box>
            <Typography>
              <strong>Nombre:</strong> {name}
            </Typography>
            <Typography>
              <strong>Email:</strong> {email}
            </Typography>
          </Box>
        </Collapse>

        <Collapse in={isEditing} timeout={300} unmountOnExit>
          <Box>
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        </Collapse>
      </Box>

      <Box mt={3}>
        <UserRolesSection roles={user?.roles || []} />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
