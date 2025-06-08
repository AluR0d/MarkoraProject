import { useEffect, useState } from 'react';
import {
  TableContainer,
  Paper,
  Button,
  Box,
  Typography,
  Collapse,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import Notification from '../atoms/Notification';
import ConfirmDialog from '../atoms/ConfirmDialog';
import { Place } from '../../types/Place';
import { PlaceService } from '../../services/placeService';
import PanelHeader from '../molecules/PanelHeader';
import PlaceFormModal from '../molecules/PlaceFormModal';
import PlaceTable from '../molecules/PlaceTable';
import PlaceFilterForm from '../molecules/PlaceFilterForm';

export default function PlaceAdminPanel() {
  const { t } = useTranslation();

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
      showSnackbar(t('admin.places.errors.load_failed'), 'error');
    }
  };

  const handleCreate = async (newData: Partial<Place>) => {
    try {
      await PlaceService.create(newData);
      setOpen(false);
      showSnackbar(t('admin.places.place_created_successfully'), 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error creando lugar', err);
      showSnackbar(
        err.response?.data?.message || t('admin.places.errors.create_failed'),
        'error'
      );
    }
  };

  const handleUpdate = async (data: Partial<Place>) => {
    if (!editPlace) return;
    try {
      await PlaceService.update(editPlace.id, data);
      setEditPlace(null);
      showSnackbar(t('admin.places.place_updated_successfully'), 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error actualizando lugar', err);
      showSnackbar(
        err.response?.data?.message || t('admin.places.errors.update_failed'),
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
      showSnackbar(t('admin.places.place_deleted_successfully'), 'success');
      loadPlaces();
    } catch (err: any) {
      console.error('Error eliminando lugar', err);
      showSnackbar(t('admin.places.errors.delete_failed'), 'error');
    } finally {
      setConfirmDialog({ open: false });
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [filters, page]);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <ConfirmDialog
        open={confirmDialog.open}
        title={t('admin.places.confirm_delete.title')}
        message={t('admin.places.confirm_delete.message')}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ open: false })}
      />

      {snackbar.open && (
        <Notification
          message={snackbar.message}
          type={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      )}

      <PanelHeader
        title={t('admin.tabs.places')}
        onCreate={() => setOpen(true)}
      >
        {t('admin.places.create_place')}
      </PanelHeader>

      <Box mb={2} textAlign="right">
        <Button
          variant="contained"
          onClick={() => setShowFilters((prev) => !prev)}
          sx={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'var(--color-accent)',
            },
          }}
        >
          {showFilters
            ? t('admin.places.hide_filters')
            : t('admin.places.show_filters')}
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

      {places.length === 0 ? (
        <Typography variant="body1" align="center" mt={4}>
          {t('admin.places.no_results')}
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
              ⬅ {t('common.previous')}
            </Button>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {t('common.page')} {page} {t('common.of')} {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              {t('common.next')} ➡
            </Button>
          </Box>
        </>
      )}
    </TableContainer>
  );
}
