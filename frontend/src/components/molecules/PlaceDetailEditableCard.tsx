import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Place } from '../../types/Place';
import axios from 'axios';
import { placeSchema } from '../../schemas/placeFormSchema';
import { ZodError } from 'zod';
import { useTranslation } from 'react-i18next';

type Props = {
  place: Place;
  onUpdate: (updated: Place) => void;
};

type EditableField = keyof Place | null;

export default function PlaceDetailEditableCard({ place, onUpdate }: Props) {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const startEditing = (field: EditableField, currentValue?: any) => {
    setEditingField(field);

    if (field === 'coords' && currentValue?.coordinates?.length === 2) {
      const [lng, lat] = currentValue.coordinates;
      setTempValue(`${lat}, ${lng}`);
    } else if (Array.isArray(currentValue)) {
      setTempValue(currentValue.join(', '));
    } else if (typeof currentValue === 'object' && currentValue !== null) {
      setTempValue(JSON.stringify(currentValue));
    } else {
      setTempValue(currentValue ?? '');
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const isValid = (field: keyof Place, value: string): string | null => {
    try {
      let parsedValue: any;

      switch (field) {
        case 'email':
        case 'types':
          parsedValue = value
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean);
          break;
        case 'rating':
        case 'user_ratings_total':
          parsedValue = Number(value);
          break;
        case 'coords':
          const parts = value.split(',').map((p) => parseFloat(p.trim()));
          if (parts.length !== 2 || parts.some((n) => isNaN(n))) {
            throw new ZodError([
              {
                path: ['coords'],
                message: 'admin.places.errors.invalid_coords',
                code: 'custom',
              },
            ]);
          }
          parsedValue = {
            type: 'Point',
            coordinates: [parts[1], parts[0]],
          };
          break;

        case 'active':
          parsedValue = value === 'true';
          break;
        default:
          parsedValue = value.trim();
      }

      placeSchema
        .pick({ [field]: true } as any)
        .parse({ [field]: parsedValue });
      return null;
    } catch (err) {
      if (err instanceof ZodError) {
        const key = err.errors[0]?.message;
        return key ? t(key) : t('admin.errors.unknown');
      }
      return t('admin.errors.unknown');
    }
  };

  const saveField = async () => {
    if (!editingField) return;

    const validationError = isValid(editingField, tempValue);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    let valueToSend: any;

    if (['email', 'types'].includes(editingField)) {
      valueToSend =
        tempValue.trim() === ''
          ? []
          : tempValue.split(',').map((e) => e.trim());
    } else if (tempValue.trim() === '') {
      valueToSend = '';
    } else if (editingField === 'coords') {
      const [lat, lng] = tempValue.split(',').map((p) => parseFloat(p.trim()));
      valueToSend = {
        type: 'Point',
        coordinates: [lng, lat],
      };
    } else if (
      ['rating', 'user_ratings_total', 'owner_id'].includes(editingField)
    ) {
      valueToSend = Number(tempValue);
    } else if (editingField === 'active') {
      valueToSend = tempValue === 'true';
    } else {
      valueToSend = tempValue;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/places/${place.id}`,
        {
          [editingField]: valueToSend,
        }
      );
      onUpdate(res.data);
      setEditingField(null);
      setSuccessMessage(t('admin.places.place_updated_successfully'));
    } catch (err: any) {
      console.error('Error al guardar el cambio', err);
      setErrorMessage(
        err?.response?.data?.message || t('admin.errors.update_failed')
      );
    }
  };

  const getPlaceholder = (field: keyof Place) => {
    const placeholders: Record<keyof Place, string> = {
      name: 'Ej: Librería Rayuela',
      zone: 'Ej: Centro Histórico',
      address: 'Ej: Calle Luna 24, 2ºA',
      phone: 'Ej: 654321987',
      second_phone: 'Ej: 954123456',
      email: 'Ej: uno@mail.com, otro@mail.com',
      website: 'Ej: https://ejemplo.com',
      opening_hours: 'Ej: L-V 9:00-14:00',
      rating: 'Ej: 4.3',
      user_ratings_total: 'Ej: 120',
      types: 'Ej: tienda, servicio',
      active: '',
      coords: 'Ej: 37.38, -5.99',
      owner_id: 'Ej: 1',
      id: '',
    };
    return placeholders[field] || '';
  };

  const renderField = (
    label: string,
    field: keyof Place,
    isBoolean = false
  ) => {
    const fieldError =
      editingField === field ? isValid(field, tempValue) : null;

    return (
      <Box display="flex" alignItems="center" mb={1} key={field}>
        <Typography sx={{ minWidth: '150px' }}>
          <strong>{label}:</strong>
        </Typography>

        {editingField === field ? (
          isBoolean ? (
            <>
              <TextField
                select
                label={t('admin.places.fields.active')}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="true">{t('common.yes')}</MenuItem>
                <MenuItem value="false">{t('common.no')}</MenuItem>
              </TextField>
              <IconButton onClick={saveField}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={cancelEditing}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <TextField
                size="small"
                fullWidth
                type={
                  ['rating', 'user_ratings_total'].includes(field)
                    ? 'number'
                    : 'text'
                }
                inputProps={
                  field === 'rating'
                    ? { step: 0.1, min: 0, max: 5 }
                    : field === 'user_ratings_total'
                      ? { step: 1, min: 0 }
                      : undefined
                }
                value={tempValue}
                placeholder={getPlaceholder(field)}
                onChange={(e) => setTempValue(e.target.value)}
                sx={{ mx: 1 }}
                error={!!fieldError}
                helperText={fieldError}
              />
              <IconButton onClick={saveField} disabled={!!fieldError}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={cancelEditing}>
                <CloseIcon />
              </IconButton>
            </>
          )
        ) : (
          <>
            <Typography sx={{ flex: 1 }}>
              {Array.isArray(place[field])
                ? (place[field] as string[]).length > 0
                  ? (place[field] as string[]).join(', ')
                  : 'N/A'
                : field === 'coords' && place.coords?.coordinates
                  ? `${place.coords.coordinates[1]}, ${place.coords.coordinates[0]}`
                  : place[field] === null ||
                      place[field] === undefined ||
                      place[field] === ''
                    ? 'N/A'
                    : place[field]?.toString()}
            </Typography>
            <IconButton onClick={() => startEditing(field, place[field])}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Box>
    );
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        {renderField(t('admin.places.fields.name'), 'name')}
        {renderField(t('admin.places.fields.zone'), 'zone')}
        {renderField(t('admin.places.fields.address'), 'address')}
        {renderField(t('admin.places.fields.phone'), 'phone')}
        {renderField(t('admin.places.fields.second_phone'), 'second_phone')}
        {renderField(t('admin.places.fields.email'), 'email')}
        {renderField(t('admin.places.fields.website'), 'website')}
        {renderField(t('admin.places.fields.opening_hours'), 'opening_hours')}
        {renderField(t('admin.places.fields.rating'), 'rating')}
        {renderField(
          t('admin.places.fields.user_ratings_total'),
          'user_ratings_total'
        )}
        {renderField(t('admin.places.fields.types'), 'types')}
        {renderField(t('admin.places.fields.active'), 'active', true)}
        {renderField(t('admin.places.fields.coords'), 'coords')}
        {renderField(t('admin.places.fields.owner_id'), 'owner_id')}
      </Paper>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
