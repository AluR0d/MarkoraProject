// src/pages/admin/places/PlaceDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Place } from '../../types/Place';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import PlaceDetailEditableCard from '../molecules/PlaceDetailEditableCard';
import PlaceMap from '../molecules/PlaceMap';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/places/${id}`)
      .then((res) => setPlace(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!place) return <Typography>No se encontró el lugar</Typography>;

  return (
    <Box p={4}>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => window.history.back()}
      >
        ← Volver
      </Button>

      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          {place.name}
        </Typography>

        <PlaceDetailEditableCard place={place} onUpdate={setPlace} />
        <PlaceMap place={place} onUpdate={setPlace} />
      </Box>
    </Box>
  );
}
