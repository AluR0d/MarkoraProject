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
  Snackbar,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [rating, setRating] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | 'true' | 'false'>(
    'all'
  );
  const [ratingOrder, setRatingOrder] = useState<'asc' | 'desc' | 'none'>(
    'none'
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success',
  });

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedZone = zone.trim();
    const numericRating = rating ? Number(rating) : undefined;

    if (
      numericRating !== undefined &&
      (numericRating < 0 || numericRating > 5)
    ) {
      setSnackbar({
        open: true,
        message: t('admin.places.filters.rating_out_of_range'),
        severity: 'error',
      });
      return;
    }

    let active: boolean | undefined;
    if (activeStatus === 'true') active = true;
    else if (activeStatus === 'false') active = false;

    onFilter({
      name: trimmedName || undefined,
      zone: trimmedZone || undefined,
      active,
      rating: numericRating,
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
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <Typography variant="h6">{t('admin.places.filters.title')}</Typography>

        <TextField
          label={t('admin.places.filters.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label={t('admin.places.filters.zone')}
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label={t('admin.places.filters.min_rating')}
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            sx={{ flex: 1 }}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="order-label">
              {t('admin.places.filters.rating_order')}
            </InputLabel>
            <Select
              labelId="order-label"
              value={ratingOrder}
              label={t('admin.places.filters.rating_order')}
              onChange={(e) => setRatingOrder(e.target.value as any)}
            >
              <MenuItem value="none">
                {t('admin.places.filters.no_order')}
              </MenuItem>
              <MenuItem value="desc">
                {t('admin.places.filters.high_to_low')}
              </MenuItem>
              <MenuItem value="asc">
                {t('admin.places.filters.low_to_high')}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <FormControl>
          <InputLabel id="active-label">
            {t('admin.places.filters.active')}
          </InputLabel>
          <Select
            labelId="active-label"
            value={activeStatus}
            label={t('admin.places.filters.active')}
            onChange={(e) => setActiveStatus(e.target.value as any)}
          >
            <MenuItem value="all">{t('admin.places.filters.all')}</MenuItem>
            <MenuItem value="true">
              {t('admin.places.filters.only_active')}
            </MenuItem>
            <MenuItem value="false">
              {t('admin.places.filters.only_inactive')}
            </MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSubmit}>
            {t('admin.places.filters.apply')}
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            {t('admin.places.filters.clear')}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
