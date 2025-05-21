import { useEffect, useState } from 'react';
import {
  TableContainer,
  Paper,
  Button,
  Box,
  Typography,
  Collapse,
} from '@mui/material';

import NotificationSnackbar from '../atoms/NotificationSnackbar';
import ConfirmDialog from '../atoms/ConfirmDialog';
import { Place } from '../../types/Place';
import { PlaceService } from '../../services/placeService';
import PanelHeader from '../molecules/PanelHeader';
import PlaceFormModal from '../molecules/PlaceFormModal';
import PlaceTable from '../molecules/PlaceTable';
import PlaceFilterForm from '../molecules/PlaceFilterForm';

export default function PlaceAdminPanel() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [editPlace, setEditPlace] = useState<Place | null>(null);
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

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    placeId?: string;
  }>({
    open: false,
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

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
      console.error('Error cargando lugares', err);
      showSnackbar('Error al cargar lugares', 'error');
    }
  };

  const handleCreate = async (newData: Partial<Place>) => {
    try {
      await PlaceService.create(newData);
      setOpen(false);
      showSnackbar('El lugar se ha creado correctamente', 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error creando lugar', err);
      showSnackbar(
        err.response?.data?.message || 'No se pudo crear el lugar',
        'error'
      );
    }
  };

  const handleUpdate = async (data: Partial<Place>) => {
    if (!editPlace) return;
    try {
      await PlaceService.update(editPlace.id, data);
      setEditPlace(null);
      showSnackbar('El lugar se ha actualizado correctamente', 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error actualizando lugar', err);
      showSnackbar(
        err.response?.data?.message || 'No se pudo actualizar el lugar',
        'error'
      );
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, placeId: id });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.placeId) return;

    try {
      await PlaceService.delete(confirmDialog.placeId);
      showSnackbar('El lugar ha sido eliminado correctamente.', 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error eliminando lugar', err);
      showSnackbar('No se pudo eliminar el lugar.', 'error');
    } finally {
      setConfirmDialog({ open: false });
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [filters, page]);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="¿Eliminar lugar?"
        message="Esta acción eliminará el lugar de forma permanente. ¿Deseas continuar?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ open: false })}
      />

      {/* Snackbar */}
      <NotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <PanelHeader title="Lugares registrados" onCreate={() => setOpen(true)}>
        Crear lugar
      </PanelHeader>

      {/* Filtros */}
      <Box mb={2} textAlign="right">
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

      {/* Modales */}
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

      {/* Tabla o mensaje vacío */}
      {places.length === 0 ? (
        <Typography variant="body1" align="center" mt={4}>
          No se encontraron lugares que coincidan con la búsqueda.
        </Typography>
      ) : (
        <>
          <PlaceTable
            places={places}
            onEdit={(place) => setEditPlace(place)}
            onDelete={handleDelete}
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
    </TableContainer>
  );
}
