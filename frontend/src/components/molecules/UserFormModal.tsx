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
  FormHelperText,
  Switch,
  FormControlLabel,
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
      const schema = isEditing
        ? baseUserSchema.extend({
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
                    (val) =>
                      val === '' || (val.length >= 6 && val.length <= 64),
                    {
                      message: 'user.errors.password_invalid_range',
                    }
                  )
                  .optional(),
          })
        : createUserSchema;

      schema.parse(trimmedData);
      setErrors({});
      onSubmit({
        name: trimmedData.name,
        email: trimmedData.email,
        password: trimmedData.password || undefined,
        roles: trimmedData.roles,
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
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-[var(--color-primary)] text-xl font-bold">
          {isEditing ? t('admin.edit_user') : t('admin.create_user')}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              fullWidth
              label={t('register.name')}
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              fullWidth
              label={t('register.email')}
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />

            {isEditing ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
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
                />
              </div>
            ) : (
              <TextField
                fullWidth
                label={t('register.password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
              />
            )}

            <FormControl fullWidth error={!!errors.roles}>
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
          </div>
        </DialogContent>

        <DialogActions className="px-6 pb-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-sm cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-accent)] transition text-sm font-medium cursor-pointer"
          >
            {isEditing ? t('common.save') : t('common.create')}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
