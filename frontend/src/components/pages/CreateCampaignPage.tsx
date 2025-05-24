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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SelectablePlaceTable from '../../components/molecules/SelectablePlaceTable';
import PlaceFilterForm from '../../components/molecules/PlaceFilterForm';
import { Place } from '../../types/Place';
import { PlaceService } from '../../services/placeService';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import ReactQuill from 'react-quill-new';
import { useTranslation } from 'react-i18next'; // Import translation hook

export default function CreateCampaignPage() {
  const { t } = useTranslation(); // Initialize translation hook
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns`,
        {
          title,
          message_template: message,
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

      setTitle('');
      setMessage('');
      setFrequency(0);
      setSelectedPlaceIds([]);

      setSnackbarOpen(true);
      setTimeout(() => setSuccessDialogOpen(true), 300);
    } catch (err: any) {
      console.error(err);
      alert(t('campaign.create_error'));
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        {t('campaign.message_body')}
      </Typography>

      <ReactQuill
        theme="snow"
        value={message}
        onChange={setMessage}
        placeholder={t('campaign.message_placeholder')}
        style={{ minHeight: '150px' }}
      />

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
        disabled={!title || !message || selectedPlaceIds.length === 0}
        onClick={handleSubmit}
      >
        {t('campaign.create_button')}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={t('campaign.success_message')}
      />

      {/* Diálogo de redirección */}
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
