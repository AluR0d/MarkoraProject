import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';
import { placeSchema } from '../../schemas/placeFormSchema';
import { Place } from '../../types/Place';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Place>) => void;
  initialData?: Place;
  isEditing?: boolean;
};

export default function PlaceFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: Props) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Partial<Place>>({
    name: '',
    zone: '',
    address: '',
    phone: '',
    second_phone: '',
    email: [],
    website: '',
    opening_hours: '',
    rating: 0,
    user_ratings_total: 0,
    types: [],
    active: true,
    coords: { type: 'Point', coordinates: [0, 0] },
  });

  const [typesInput, setTypesInput] = useState('');
  const [coordsInput, setCoordsInput] = useState('0,0');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'success' | 'error',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        rating:
          typeof initialData.rating === 'number'
            ? initialData.rating
            : parseFloat(
                (initialData.rating as any).toString().replace(',', '.')
              ),
      });
      setTypesInput(initialData.types?.join(', ') || '');
      setCoordsInput(initialData.coords?.coordinates?.join(', ') || '0,0');
    } else {
      setFormData({
        name: '',
        zone: '',
        address: '',
        phone: '',
        second_phone: '',
        email: [],
        website: '',
        opening_hours: '',
        rating: 0,
        user_ratings_total: 0,
        types: [],
        active: true,
        coords: { type: 'Point', coordinates: [0, 0] },
      });
      setTypesInput('');
      setCoordsInput('0,0');
    }
    setErrors({});
  }, [initialData, open]);

  const handleSubmit = () => {
    try {
      const coordsMatch = coordsInput.match(
        /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/
      );

      const coordinates: [number, number] = coordsMatch
        ? [parseFloat(coordsMatch[1]), parseFloat(coordsMatch[3])]
        : [0, 0]; // fallback, aunque esto no debería ocurrir si hay validación previa

      const trimmedData = {
        ...formData,
        name: formData.name?.trim() || '',
        zone: formData.zone?.trim() || '',
        address: formData.address?.trim() || '',
        website: formData.website?.trim() || '',
        opening_hours: formData.opening_hours?.trim() || '',
        email: formData.email?.filter((e) => e.trim()) || [],
        types: typesInput
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
        coords: {
          type: 'Point',
          coordinates,
        },
      };

      const parsed = placeSchema.parse(trimmedData);
      onSubmit(parsed as any);
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof Place, string>> = {};
        err.errors.forEach((e) => {
          const field = e.path[0] as keyof Place;
          fieldErrors[field] = t(e.message);
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditing
          ? t('admin.places.edit_place')
          : t('admin.places.create_place')}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={t('admin.places.fields.name')}
          required
          margin="normal"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name && t(errors.name)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.zone')}
          required
          margin="normal"
          value={formData.zone || ''}
          onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
          error={!!errors.zone}
          helperText={errors.zone && t(errors.zone)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.address')}
          required
          margin="normal"
          value={formData.address || ''}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          error={!!errors.address}
          helperText={errors.address && t(errors.address)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.phone')}
          margin="normal"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={!!errors.phone}
          helperText={errors.phone && t(errors.phone)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.second_phone')}
          margin="normal"
          value={formData.second_phone || ''}
          onChange={(e) =>
            setFormData({ ...formData, second_phone: e.target.value })
          }
          error={!!errors.second_phone}
          helperText={errors.second_phone && t(errors.second_phone)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.email')}
          margin="normal"
          value={(formData.email || []).join(', ')}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value.split(',').map((e) => e.trim()),
            })
          }
          error={!!errors.email}
          helperText={errors.email && t(errors.email)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.website')}
          margin="normal"
          value={formData.website || ''}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
          error={!!errors.website}
          helperText={errors.website && t(errors.website)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.opening_hours')}
          margin="normal"
          value={formData.opening_hours || ''}
          onChange={(e) =>
            setFormData({ ...formData, opening_hours: e.target.value })
          }
          error={!!errors.opening_hours}
          helperText={errors.opening_hours && t(errors.opening_hours)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.rating')}
          margin="normal"
          type="number"
          inputProps={{ step: 0.1, min: 0, max: 5 }}
          value={formData.rating ?? 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              rating: parseFloat(e.target.value.replace(',', '.')),
            })
          }
          error={!!errors.rating}
          helperText={errors.rating && t(errors.rating)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.user_ratings_total')}
          type="number"
          margin="normal"
          value={formData.user_ratings_total ?? 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              user_ratings_total: parseInt(e.target.value),
            })
          }
          error={!!errors.user_ratings_total}
          helperText={errors.user_ratings_total && t(errors.user_ratings_total)}
        />
        <TextField
          fullWidth
          required
          label={t('admin.places.fields.types')}
          margin="normal"
          value={typesInput}
          onChange={(e) => setTypesInput(e.target.value)}
          error={!!errors.types}
          helperText={errors.types && t(errors.types)}
        />
        <TextField
          fullWidth
          label={t('admin.places.fields.coords')}
          margin="normal"
          value={coordsInput}
          onChange={(e) => setCoordsInput(e.target.value)}
          error={!!errors.coords}
          helperText={
            errors.coords
              ? t(errors.coords)
              : !/^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/.test(coordsInput)
                ? t('admin.places.errors.invalid_coords')
                : ''
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.active ?? true}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
          }
          label={t('admin.places.fields.active')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? t('common.save') : t('common.create')}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
