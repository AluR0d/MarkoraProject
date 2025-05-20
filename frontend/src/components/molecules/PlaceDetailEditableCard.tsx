import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Snackbar,
  Alert,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Place } from '../../types/Place';
import axios from 'axios';

type Props = {
  place: Place;
  onUpdate: (updated: Place) => void;
};

type EditableField = keyof Place | null;

export default function PlaceDetailEditableCard({ place, onUpdate }: Props) {
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const startEditing = (field: EditableField, currentValue?: any) => {
    setEditingField(field);

    if (Array.isArray(currentValue)) {
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
    if (value.trim() === '') {
      if (field === 'zone') return 'La zona es obligatoria';
      if (field === 'name') return 'El nombre es obligatorio';
      if (field === 'address') return 'La dirección es obligatoria';
      if (field === 'types') return 'Debes indicar al menos un tipo';
      return null;
    }

    switch (field) {
      case 'zone':
        return value.length > 50 ? 'Máximo 50 caracteres' : null;
      case 'address':
        return value.length > 100 ? 'Máximo 100 caracteres' : null;
      case 'phone':
      case 'second_phone':
        return /^\d{9}$/.test(value)
          ? null
          : 'Debe tener exactamente 9 dígitos';
      case 'email':
        return value
          .split(',')
          .some((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()))
          ? 'Formato de email inválido en alguno de los valores'
          : null;
      case 'types':
        const array = value
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
        return array.length === 0 ? 'Debes indicar al menos un tipo' : null;
      case 'rating':
        const rating = parseFloat(value);
        return isNaN(rating) || rating < 0 || rating > 5
          ? 'Debe ser un número entre 0 y 5'
          : null;
      case 'user_ratings_total':
        return !/^\d+$/.test(value) ? 'Debe ser un número entero ≥ 0' : null;
      case 'coords':
        try {
          const parsed = JSON.parse(value);
          if (
            typeof parsed !== 'object' ||
            parsed.type !== 'Point' ||
            !Array.isArray(parsed.coordinates)
          ) {
            return 'Debe tener formato JSON con type y coordinates';
          }
          return null;
        } catch {
          return 'Formato JSON inválido';
        }
      default:
        return null;
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
      valueToSend = JSON.parse(tempValue);
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
      setSuccessMessage('Campo actualizado correctamente.');
    } catch (err: any) {
      console.error('Error al guardar el cambio', err);
      setErrorMessage(
        err?.response?.data?.message || 'No se pudo guardar el cambio.'
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
      coords: 'Ej: {"type":"Point","coordinates":[-5.99,37.38]}',
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
              <Switch
                checked={tempValue === 'true'}
                onChange={(e) => setTempValue(e.target.checked.toString())}
              />
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
                : typeof place[field] === 'object'
                  ? JSON.stringify(place[field])
                  : place[field]?.toString() || 'N/A'}
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
        {renderField('Nombre', 'name')}
        {renderField('Zona', 'zone')}
        {renderField('Dirección', 'address')}
        {renderField('Teléfono', 'phone')}
        {renderField('Segundo Teléfono', 'second_phone')}
        {renderField('Emails (separadas por coma)', 'email')}
        {renderField('Web', 'website')}
        {renderField('Horario', 'opening_hours')}
        {renderField('Valoración', 'rating')}
        {renderField('Total valoraciones', 'user_ratings_total')}
        {renderField('Tipos (separados por coma)', 'types')}
        {renderField('Activo', 'active', true)}
        {renderField('Coordenadas (JSON)', 'coords')}
        {renderField('Propietario ID', 'owner_id')}
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
