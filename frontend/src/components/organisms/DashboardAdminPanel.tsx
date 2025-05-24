import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

type DashboardData = {
  totalCampaigns: number;
  averagePlacesPerCampaign: number;
  totalCreditSpent: number;
  totalEmailsSent: number;
};

export default function DashboardAdminPanel() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>('all');

  const fetchDashboardData = async (selectedRange: string) => {
    setLoading(true);
    try {
      const params =
        selectedRange === 'all'
          ? ''
          : `?range=${selectedRange === '7d' ? 7 : 30}`;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/campaigns/admin/dashboard${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(range);
  }, [range]);

  const exportToPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const now = new Date();
    const formattedDate = now.toLocaleString();

    // Encabezado
    doc.setFontSize(20);
    doc.text(t('dashboard.title'), 14, 20);

    doc.setFontSize(14);
    doc.text(t('dashboard.general_stats'), 14, 35);

    // Estadísticas
    doc.setFontSize(12);
    const stats = [
      [t('dashboard.total_campaigns'), data.totalCampaigns],
      [
        t('dashboard.average_places_per_campaign'),
        data.averagePlacesPerCampaign.toFixed(2),
      ],
      [t('dashboard.total_credit_spent'), data.totalCreditSpent],
      [t('dashboard.total_emails_sent'), data.totalEmailsSent],
    ];

    stats.forEach(([label, value], i) => {
      doc.text(`${label}: ${value}`, 14, 50 + i * 10);
    });

    // Pie de página
    doc.setFontSize(10);
    doc.text(`${t('dashboard.generated_on')} ${formattedDate}`, 14, 105);

    // Indicar rango si no es "all"
    if (range === '7d') {
      doc.text(t('dashboard.range_last_7_days'), 14, 112);
    } else if (range === '30d') {
      doc.text(t('dashboard.range_last_30_days'), 14, 112);
    }

    doc.save('informe_dashboard_markora.pdf');
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        📊 {t('dashboard.report_title')}
      </Typography>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('dashboard.date_range')}</InputLabel>
          <Select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            label={t('dashboard.date_range')}
          >
            <MenuItem value="all">{t('dashboard.all_data')}</MenuItem>
            <MenuItem value="30d">{t('dashboard.last_30_days')}</MenuItem>
            <MenuItem value="7d">{t('dashboard.last_7_days')}</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={exportToPDF}>
          📥 {t('dashboard.export_as_pdf')}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : !data ? (
        <Typography color="error" align="center" mt={4}>
          {t('dashboard.error_loading_data')}
        </Typography>
      ) : (
        <Grid container spacing={3} mt={2}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('dashboard.total_campaigns')}
              </Typography>
              <Typography variant="h4">{data.totalCampaigns}</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('dashboard.average_places_per_campaign')}
              </Typography>
              <Typography variant="h4">
                {data.averagePlacesPerCampaign.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('dashboard.total_credit_spent')}
              </Typography>
              <Typography variant="h4">💰 {data.totalCreditSpent}</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                {t('dashboard.total_emails_sent')}
              </Typography>
              <Typography variant="h4">✉️ {data.totalEmailsSent}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
