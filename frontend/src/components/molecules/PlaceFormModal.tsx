import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
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
    owner_id: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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
        owner_id: 0,
      });
    }
  }, [initialData, open]);

  const isValid =
    !!formData.name?.trim() &&
    !!formData.zone?.trim() &&
    !!formData.address?.trim() &&
    !!formData.types &&
    formData.types.length > 0;

  const handleSubmit = () => {
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== null)
    );
    onSubmit(cleanData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditing ? 'Editar lugar' : 'Crear nuevo lugar'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre"
          required
          margin="normal"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Zona"
          required
          margin="normal"
          value={formData.zone || ''}
          onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
        />
        <TextField
          fullWidth
          label="Dirección"
          required
          margin="normal"
          value={formData.address || ''}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Teléfono"
          margin="normal"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <TextField
          fullWidth
          label="Segundo teléfono"
          margin="normal"
          value={formData.second_phone || ''}
          onChange={(e) =>
            setFormData({ ...formData, second_phone: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Email (separado por comas)"
          margin="normal"
          value={(formData.email || []).join(', ')}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value.split(',').map((e) => e.trim()),
            })
          }
        />
        <TextField
          fullWidth
          label="Web"
          margin="normal"
          value={formData.website || ''}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Horario"
          margin="normal"
          value={formData.opening_hours || ''}
          onChange={(e) =>
            setFormData({ ...formData, opening_hours: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Rating (0.0 - 5.0)"
          margin="normal"
          type="number"
          inputProps={{ step: 0.1, min: 0, max: 5 }}
          value={formData.rating ?? 0}
          onChange={(e) =>
            setFormData({ ...formData, rating: parseFloat(e.target.value) })
          }
        />
        <TextField
          fullWidth
          label="Valoraciones totales"
          type="number"
          margin="normal"
          value={formData.user_ratings_total ?? 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              user_ratings_total: parseInt(e.target.value),
            })
          }
        />
        <TextField
          fullWidth
          label="Tipos (separados por comas)"
          required
          margin="normal"
          value={(formData.types || []).join(', ')}
          onChange={(e) =>
            setFormData({
              ...formData,
              types: e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t),
            })
          }
        />
        <TextField
          fullWidth
          label="Coordenadas (lat, lng)"
          margin="normal"
          value={formData.coords?.coordinates?.join(', ') || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              coords: {
                type: 'Point',
                coordinates: e.target.value
                  .split(',')
                  .map((v) => parseFloat(v.trim())) as [number, number],
              },
            })
          }
        />
        <TextField
          fullWidth
          label="ID del propietario"
          margin="normal"
          type="number"
          value={formData.owner_id || ''}
          onChange={(e) =>
            setFormData({ ...formData, owner_id: parseInt(e.target.value) })
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
          label="¿Lugar activo?"
        />
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
