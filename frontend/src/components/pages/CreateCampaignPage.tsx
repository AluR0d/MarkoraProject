import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Collapse,
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SelectablePlaceTable from '../../components/molecules/SelectablePlaceTable';
import PlaceFilterForm from '../../components/molecules/PlaceFilterForm';
import { Place } from '../../types/Place';
import { PlaceService } from '../../services/placeService';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import ReactQuill from 'react-quill-new';
import { useTranslation } from 'react-i18next';
import { createCampaignSchema } from '../../schemas/createCampaignSchema';
import { ZodError } from 'zod';

export default function CreateCampaignPage() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [errors, setErrors] = useState<{ title?: string; message?: string }>(
    {}
  );
  const [frequency, setFrequency] = useState<number>(0);
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
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

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

  const handleToggleSelectAll = (ids: string[], selectAll: boolean) => {
    setSelectedPlaceIds((prev) =>
      selectAll
        ? [...new Set([...prev, ...ids])]
        : prev.filter((id) => !ids.includes(id))
    );
  };

  const handleSubmit = async () => {
    try {
      const plainMessage = formData.message.replace(/<[^>]+>/g, '').trim();
      const trimmedData = {
        title: formData.title.trim(),
        message: plainMessage,
      };
      const validated = createCampaignSchema.parse(trimmedData);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns`,
        {
          title: validated.title,
          message_template: formData.message,
          place_ids: selectedPlaceIds,
          frequency: frequency === 0 ? null : frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (user) {
        setUser({ ...user, balance: user.balance - 5 });
      }

      setFormData({ title: '', message: '' });
      setFrequency(0);
      setSelectedPlaceIds([]);
      setErrors({});

      setSnackbarMessage(t('campaign.success_message'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => setSuccessDialogOpen(true), 300);
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fieldErrors: { title?: string; message?: string } = {};
        err.errors.forEach((e) => {
          if (e.path[0] === 'title' || e.path[0] === 'message') {
            fieldErrors[e.path[0]] = e.message;
          }
        });
        setErrors(fieldErrors);
        setSnackbarMessage(t('campaign.errors.create_error'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        console.error(err);
        setSnackbarMessage(t('campaign.errors.create_error'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('campaign.create_title')}
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('campaign.balance')}: {user?.balance ?? t('common.loading')}{' '}
        {t('common.credits')}
      </Typography>

      <TextField
        fullWidth
        label={t('campaign.title_label')}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        margin="normal"
        inputProps={{ maxLength: 50 }}
        error={!!errors.title}
        helperText={
          errors.title ? t(errors.title) : `${formData.title.length}/50`
        }
        required
      />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        {t('campaign.message_body')}
      </Typography>

      <ReactQuill
        theme="snow"
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        placeholder={t('campaign.message_placeholder')}
        style={{ minHeight: '150px' }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography
          variant="caption"
          color={errors.message ? 'error' : 'text.secondary'}
        >
          {errors.message ? t(errors.message) : ''}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formData.message.replace(/<[^>]+>/g, '').trim().length}/200
        </Typography>
      </Box>

      <TextField
        fullWidth
        type="number"
        label={t('campaign.frequency_label')}
        value={frequency}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setFrequency(isNaN(value) ? 0 : Math.max(0, value));
        }}
        margin="normal"
        inputProps={{ min: 0 }}
        helperText={t('campaign.frequency_helper')}
      />

      <Box textAlign="right" mb={2}>
        <Button
          variant="outlined"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters
            ? t('campaign.hide_filters')
            : t('campaign.show_filters')}
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
            {t('campaign.no_places_found')}
          </Typography>
        ) : (
          <>
            <SelectablePlaceTable
              places={places}
              selectedIds={selectedPlaceIds}
              onToggleSelect={togglePlace}
              onToggleSelectAll={handleToggleSelectAll}
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
      </Paper>

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        disabled={selectedPlaceIds.length === 0}
        onClick={handleSubmit}
      >
        {t('campaign.create_button')}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
      >
        <DialogTitle>{t('campaign.success_dialog_title')}</DialogTitle>
        <DialogContent>
          <Typography>{t('campaign.success_dialog_message')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>
            {t('common.no')}
          </Button>
          <Button variant="contained" onClick={() => navigate('/my-campaigns')}>
            {t('common.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
