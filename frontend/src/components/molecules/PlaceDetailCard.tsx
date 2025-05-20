// src/app/components/places/PlaceDetailCard.tsx
import { Place } from '../../types/Place';
import { Paper, Typography } from '@mui/material';

type Props = {
  place: Place;
};

export default function PlaceDetailCard({ place }: Props) {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography>
        <strong>Zona:</strong> {place.zone || 'N/A'}
      </Typography>
      <Typography>
        <strong>Dirección:</strong> {place.address || 'N/A'}
      </Typography>
      <Typography>
        <strong>Teléfono:</strong> {place.phone || 'N/A'}
      </Typography>
      <Typography>
        <strong>Segundo Teléfono:</strong> {place.second_phone || 'N/A'}
      </Typography>
      <Typography>
        <strong>Emails:</strong> {place.email?.join(', ') || 'N/A'}
      </Typography>
      <Typography>
        <strong>Web:</strong> {place.website || 'N/A'}
      </Typography>
      <Typography>
        <strong>Horario:</strong> {place.opening_hours || 'N/A'}
      </Typography>
      <Typography>
        <strong>Valoración:</strong> {place.rating || 'N/A'} (
        {place.user_ratings_total || 'N/A'} votos)
      </Typography>
      <Typography>
        <strong>Tipos:</strong> {place.types?.join(', ') || 'N/A'}
      </Typography>
      <Typography>
        <strong>Activo:</strong> {place.active ? 'Sí' : 'No'}
      </Typography>
      <Typography>
        <strong>Coordenadas:</strong>{' '}
        {place.coords?.coordinates
          ? `${place.coords.coordinates[1]}, ${place.coords.coordinates[0]}`
          : 'N/A'}
      </Typography>
      <Typography>
        <strong>Propietario ID:</strong> {place.owner_id || 'N/A'}
      </Typography>
    </Paper>
  );
}
