import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

type Props = {
  onFilter: (filters: {
    name?: string;
    zone?: string;
    active?: boolean;
    rating?: number;
    ratingOrder?: 'asc' | 'desc';
  }) => void;
};

export default function PlaceFilterForm({ onFilter }: Props) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [rating, setRating] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | 'true' | 'false'>(
    'all'
  );
  const [ratingOrder, setRatingOrder] = useState<'asc' | 'desc' | 'none'>(
    'none'
  );

  const handleSubmit = () => {
    let active: boolean | undefined;
    if (activeStatus === 'true') active = true;
    else if (activeStatus === 'false') active = false;

    onFilter({
      name: name || undefined,
      zone: zone || undefined,
      active,
      rating: rating ? Number(rating) : undefined,
      ratingOrder: ratingOrder !== 'none' ? ratingOrder : undefined,
    });
  };

  const handleReset = () => {
    setName('');
    setZone('');
    setRating('');
    setActiveStatus('all');
    setRatingOrder('none');
    onFilter({});
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
      <Typography variant="h6">Filtros de búsqueda</Typography>

      <TextField
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Zona"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
      />

      {/* Campo de puntuación mínima + orden horizontal */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Puntuación mínima"
          type="number"
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="order-label">Orden de puntuación</InputLabel>
          <Select
            labelId="order-label"
            value={ratingOrder}
            label="Orden de puntuación"
            onChange={(e) => setRatingOrder(e.target.value as any)}
          >
            <MenuItem value="none">Sin orden</MenuItem>
            <MenuItem value="desc">Mayor a menor</MenuItem>
            <MenuItem value="asc">Menor a mayor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <FormControl>
        <InputLabel id="active-label">¿Lugar activo?</InputLabel>
        <Select
          labelId="active-label"
          value={activeStatus}
          label="¿Lugar activo?"
          onChange={(e) => setActiveStatus(e.target.value as any)}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="true">Solo activos</MenuItem>
          <MenuItem value="false">Solo inactivos</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Filtrar
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Limpiar
        </Button>
      </Box>
    </Box>
  );
}
