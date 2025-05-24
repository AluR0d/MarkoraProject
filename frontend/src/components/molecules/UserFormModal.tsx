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
  FormHelperText,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ZodError, z } from 'zod';
import { createUserSchema, baseUserSchema } from '../../schemas/userFormSchema';

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
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: [] as number[],
  });

  const [enablePassword, setEnablePassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'email' | 'password' | 'roles', string>>
  >({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
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
    setErrors({});
    setEnablePassword(false);
  }, [initialData, open]);

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: '' });
    };

  const handleSelectChange = (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, roles: value as number[] });
    setErrors({ ...errors, roles: '' });
  };

  const handleTogglePassword = () => {
    setEnablePassword((prev) => {
      const newState = !prev;
      if (!newState) {
        setFormData((prevData) => ({ ...prevData, password: '' }));
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
      }
      return newState;
    });
  };

  const handleSubmit = () => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      roles: formData.roles,
    };

    try {
      let schema;
      if (isEditing) {
        schema = baseUserSchema.extend({
          password: enablePassword
            ? z
                .string()
                .trim()
                .nonempty('register.errors.empty_password')
                .min(6, 'register.errors.password_too_short')
                .max(64, 'register.errors.password_too_long')
            : z
                .string()
                .transform((val) => val.trim())
                .refine(
                  (val) => val === '' || (val.length >= 6 && val.length <= 64),
                  {
                    message: 'user.errors.password_invalid_range',
                  }
                )
                .optional(),
        });
      } else {
        schema = createUserSchema;
      }

      schema.parse(trimmedData);
      setErrors({});
      onSubmit({
        name: trimmedData.name,
        email: trimmedData.email,
        password: trimmedData.password || undefined,
        roles: trimmedData.roles,
      });

      setSnackbar({
        open: true,
        message: isEditing
          ? t('admin.user_updated_successfully')
          : t('admin.user_created_successfully'),
        severity: 'success',
      });

      onClose();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<
          Record<'name' | 'email' | 'password' | 'roles', string>
        > = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof formData;
          fieldErrors[field] = t(err.message);
        });
        setErrors(fieldErrors);
        return;
      }

      const message =
        error.response?.data?.message || t('admin.errors.unknown');
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? t('admin.edit_user') : t('admin.create_user')}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('register.name')}
            margin="normal"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label={t('register.email')}
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
          />

          {isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label={t('admin.new_password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={!enablePassword}
                error={!!errors.password}
                helperText={errors.password}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={enablePassword}
                    onChange={handleTogglePassword}
                    color="primary"
                  />
                }
                label={
                  enablePassword
                    ? t('admin.disable_password')
                    : t('admin.enable_password')
                }
                labelPlacement="end"
              />
            </Box>
          ) : (
            <TextField
              fullWidth
              label={t('register.password')}
              type="password"
              margin="normal"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mt: 2 }}
            />
          )}

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.roles}
            variant="outlined"
          >
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={formData.roles}
              onChange={handleSelectChange}
              label="Roles"
              renderValue={(selected) =>
                roles
                  .filter((r) => (selected as number[]).includes(r.id))
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
            {errors.roles && <FormHelperText>{errors.roles}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditing ? t('common.save') : t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}
