import { useEffect, useState } from 'react';
import { TableContainer, Paper, Button, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';

import { Place } from '../../types/Place';
import { PlaceService } from '../../services/placeService';
import PanelHeader from '../molecules/PanelHeader';
import PlaceFormModal from '../molecules/PlaceFormModal';
import PlaceTable from '../molecules/PlaceTable';

export default function PlaceAdminPanel() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [editPlace, setEditPlace] = useState<Place | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadPlaces = async () => {
    try {
      const res = await PlaceService.getAll(page, limit);
      setPlaces(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error cargando lugares', err);
    }
  };

  const handleCreate = async (newData: Partial<Place>) => {
    try {
      await PlaceService.create(newData);
      setOpen(false);
      Swal.fire('Creado', 'El lugar se ha creado correctamente', 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error creando lugar', err);
      Swal.fire(
        'Error',
        err.response?.data?.message || 'No se pudo crear',
        'error'
      );
    }
  };

  const handleUpdate = async (data: Partial<Place>) => {
    if (!editPlace) return;
    try {
      await PlaceService.update(editPlace.id, data);
      setEditPlace(null);
      Swal.fire(
        'Actualizado',
        'El lugar se ha actualizado correctamente',
        'success'
      );
      loadPlaces();
    } catch (err: any) {
      console.error('Error actualizando lugar', err);
      Swal.fire(
        'Error',
        err.response?.data?.message || 'No se pudo actualizar',
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar lugar?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await PlaceService.delete(id);
        Swal.fire('Eliminado', 'El lugar ha sido eliminado', 'success');
        loadPlaces();
      } catch (err: any) {
        console.error('Error eliminando lugar', err);
        Swal.fire('Error', 'No se pudo eliminar el lugar', 'error');
      }
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces, page]);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <PanelHeader title="Lugares registrados" onCreate={() => setOpen(true)} />

      <PlaceFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
        isEditing={false}
      />

      <PlaceFormModal
        open={!!editPlace}
        onClose={() => setEditPlace(null)}
        onSubmit={handleUpdate}
        initialData={editPlace || undefined}
        isEditing
      />

      <PlaceTable
        places={places}
        onEdit={(place) => setEditPlace(place)}
        onDelete={(id) => handleDelete(id)}
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
    </TableContainer>
  );
}
