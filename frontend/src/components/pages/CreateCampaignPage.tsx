import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Collapse,
  Box,
} from '@mui/material';

import SelectablePlaceTable from '../../components/molecules/SelectablePlaceTable';
import PlaceFilterForm from '../../components/molecules/PlaceFilterForm';
import { Place } from '../../types/Place';
import { PlaceService } from '../../services/placeService';
import axios from 'axios';

export default function CreateCampaignPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{
    name?: string;
    zone?: string;
    active?: boolean;
    rating?: number;
    ratingOrder?: 'asc' | 'desc';
  }>({});
  const [showFilters, setShowFilters] = useState(false);

  const loadPlaces = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters.name && { name: filters.name }),
        ...(filters.zone && { zone: filters.zone }),
        ...(filters.rating !== undefined
          ? { rating: String(filters.rating) }
          : {}),
        ...(filters.active !== undefined
          ? { active: String(filters.active) }
          : {}),
        ...(filters.ratingOrder
          ? { orderBy: 'rating', order: filters.ratingOrder }
          : {}),
      }).toString();

      const res = await PlaceService.getFiltered(queryParams);
      setPlaces(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error al cargar lugares', err);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [filters, page]);

  const togglePlace = (placeId: string) => {
    setSelectedPlaceIds((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns`,
        {
          title,
          message_template: message,
          place_ids: selectedPlaceIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Campaña creada correctamente');
      setTitle('');
      setMessage('');
      setSelectedPlaceIds([]);
    } catch (err: any) {
      console.error(err);
      alert('Error al crear la campaña');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear nueva campaña
      </Typography>

      <TextField
        fullWidth
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        margin="normal"
      />

      <Box textAlign="right" mb={2}>
        <Button
          variant="outlined"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <PlaceFilterForm
          onFilter={(newFilters) => {
            setPage(1);
            setFilters(newFilters);
          }}
        />
      </Collapse>

      <Paper sx={{ mt: 2, p: 2 }}>
        {places.length === 0 ? (
          <Typography align="center" sx={{ mt: 3 }}>
            No se encontraron lugares que coincidan con la búsqueda.
          </Typography>
        ) : (
          <>
            <SelectablePlaceTable
              places={places}
              selectedIds={selectedPlaceIds}
              onToggleSelect={togglePlace}
            />

            <Box display="flex" justifyContent="center" mt={2} gap={2}>
              <Button
                variant="outlined"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ⬅ Anterior
              </Button>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Página {page} de {totalPages}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente ➡
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        disabled={!title || !message || selectedPlaceIds.length === 0}
        onClick={handleSubmit}
      >
        Crear campaña
      </Button>
    </Container>
  );
}
