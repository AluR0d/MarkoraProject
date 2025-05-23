// ✅ Nuevo archivo completo: MyCampaignsPage.tsx con loader visual
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { Campaign } from '../../types/Campaign';
import NotificationSnackbar from '../../components/atoms/NotificationSnackbar';

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    campaignId: number | null;
  }>({ open: false, campaignId: null });
  const [loadingCampaignId, setLoadingCampaignId] = useState<number | null>(
    null
  );

  const loadCampaigns = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/campaigns/mine`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error cargando campañas', err);
      setSnackbar({
        open: true,
        message: 'Error al cargar campañas',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    loadCampaigns();
    const interval = setInterval(loadCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendCampaign = async (id: number) => {
    setLoadingCampaignId(id);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${id}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: 'success',
      });
    } catch (err: any) {
      console.error(err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          'Error al enviar los correos de la campaña',
        severity: 'error',
      });
    } finally {
      setLoadingCampaignId(null);
    }
  };

  const handleToggleActive = async (campaign: Campaign) => {
    if (!campaign.active) {
      setConfirmDialog({ open: true, campaignId: campaign.id });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${campaign.id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: res.data.message,
        severity: 'success',
      });
      loadCampaigns();
    } catch (err: any) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al cambiar el estado',
        severity: 'error',
      });
    }
  };

  const handleToggleConfirmed = async () => {
    const id = confirmDialog.campaignId;
    if (!id) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: 'success',
      });
      loadCampaigns();
    } catch (err: any) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al cambiar el estado',
        severity: 'error',
      });
    } finally {
      setConfirmDialog({ open: false, campaignId: null });
    }
  };

  const activeCampaigns = campaigns.filter((c) => c.active);
  const archivedCampaigns = campaigns.filter((c) => !c.active);

  const renderCampaignCard = (campaign: Campaign) => {
    const hasPending = campaign.campaignPlaces.some(
      (cp) => cp.status !== 'SENT'
    );

    return (
      <Paper key={campaign.id} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{campaign.title}</Typography>

        {!campaign.active && (
          <Typography variant="body2" color="error" fontWeight="bold">
            Archivado
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          Creada: {new Date(campaign.created_at).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2">Lugares:</Typography>
        {campaign.campaignPlaces.map((cp, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Chip
              label={
                campaign.active
                  ? `${cp.place.name} — ${cp.status} (${cp.send_count ?? 0} envío/s)`
                  : `${cp.place.name} — ARCHIVED (${cp.send_count ?? 0} envío/s)`
              }
              color={
                campaign.active
                  ? cp.status === 'SENT'
                    ? 'success'
                    : 'warning'
                  : 'error'
              }
              variant="outlined"
              sx={{ mr: 1 }}
            />
            {cp.sent_at && (
              <Typography variant="caption">
                Enviado: {new Date(cp.sent_at).toLocaleString()}
              </Typography>
            )}
          </Box>
        ))}

        {campaign.active && hasPending ? (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleSendCampaign(campaign.id)}
              disabled={loadingCampaignId === campaign.id}
            >
              {loadingCampaignId === campaign.id ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Enviando...
                </>
              ) : (
                'Enviar campaña ahora'
              )}
            </Button>
          </Box>
        ) : campaign.active ? (
          <Typography
            variant="body2"
            color="success.main"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            ✅ Campaña enviada
          </Typography>
        ) : null}

        <Button
          variant="outlined"
          color={campaign.active ? 'error' : 'success'}
          onClick={() => handleToggleActive(campaign)}
          sx={{ mt: 2, ml: 1 }}
        >
          {campaign.active ? 'Archivar campaña' : 'Reactivar campaña'}
        </Button>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis campañas
      </Typography>

      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        Campañas activas
      </Typography>
      {activeCampaigns.length === 0 ? (
        <Typography>No tienes campañas activas.</Typography>
      ) : (
        activeCampaigns.map(renderCampaignCard)
      )}

      <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
        Archivadas
      </Typography>
      {archivedCampaigns.length === 0 ? (
        <Typography>No tienes campañas archivadas.</Typography>
      ) : (
        archivedCampaigns.map(renderCampaignCard)
      )}

      <NotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, campaignId: null })}
      >
        <DialogTitle>¿Reactivar campaña?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Si reactivas esta campaña, se reiniciarán los envíos anteriores y
            podrás volver a enviar correos. ¿Estás seguro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, campaignId: null })}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleToggleConfirmed}
            color="primary"
            variant="contained"
          >
            Reactivar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
