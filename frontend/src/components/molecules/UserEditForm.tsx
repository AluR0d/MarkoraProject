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
import UserRolesSection from './UserRolesSection';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';
import { updateUserSchema } from '../../schemas/updateUserSchema';

export default function UserEditForm() {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const token = localStorage.getItem('token');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'email', string>>
  >({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange =
    (field: 'name' | 'email') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: '' });
    };

  const handleSubmit = async () => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    try {
      updateUserSchema.parse(trimmedData);
      setErrors({});

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user?.id}`,
        trimmedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (user?.id) {
        setUser({ ...user, ...trimmedData, id: user.id });
        setFormData(trimmedData); // 🧼 Reflejar los datos sin espacios
      }

      setSnackbar({
        open: true,
        message: t('profile.success'),
        severity: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<'name' | 'email', string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as 'name' | 'email';
          fieldErrors[field] = t(err.message);
        });
        setErrors(fieldErrors);
        return;
      }

      const message =
        error.response?.data?.message || t('profile.errors.unknown');
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Box mt={6}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{t('profile.title')}</Typography>
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
              <strong>{t('register.name')}:</strong> {formData.name}
            </Typography>
            <Typography>
              <strong>{t('register.email')}:</strong> {formData.email}
            </Typography>
          </Box>
        </Collapse>

        <Collapse in={isEditing} timeout={300} unmountOnExit>
          <Box>
            <TextField
              label={t('register.name')}
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label={t('register.email')}
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>
        </Collapse>
      </Box>

      <Box mt={3}>
        <UserRolesSection roles={user?.roles || []} />
      </Box>

      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
