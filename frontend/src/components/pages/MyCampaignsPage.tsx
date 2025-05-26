import { useEffect, useState } from 'react';
import axios from 'axios';
import { Campaign } from '../../types/Campaign';
import { useTranslation } from 'react-i18next';
import { IoIosArchive, IoIosSend } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';
import Notification from '../../components/atoms/Notification';

export default function MyCampaignsPage() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    campaignId: number | null;
  }>({ open: false, campaignId: null });
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const loadCampaigns = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/campaigns/mine`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setCampaigns(res.data);
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al cargar campañas',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    loadCampaigns();
    const interval = setInterval(loadCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (id: number) => {
    setLoadingId(id);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${id}/send`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSnackbar({ open: true, message: res.data.message, type: 'success' });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al enviar campaña',
        type: 'error',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggle = async (campaign: Campaign) => {
    if (!campaign.active) {
      setConfirmDialog({ open: true, campaignId: campaign.id });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${campaign.id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSnackbar({ open: true, message: res.data.message, type: 'success' });
      loadCampaigns();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al actualizar campaña',
        type: 'error',
      });
    }
  };

  const confirmToggle = async () => {
    if (!confirmDialog.campaignId) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${confirmDialog.campaignId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSnackbar({ open: true, message: res.data.message, type: 'success' });
      loadCampaigns();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al actualizar campaña',
        type: 'error',
      });
    } finally {
      setConfirmDialog({ open: false, campaignId: null });
    }
  };

  const activeCampaigns = campaigns.filter((c) => c.active);
  const archivedCampaigns = campaigns.filter((c) => !c.active);

  const renderCard = (campaign: Campaign) => {
    const hasPending = campaign.campaignPlaces.some(
      (cp) => cp.status !== 'SENT'
    );

    return (
      <div
        key={campaign.id}
        className="bg-white shadow-md border border-gray-200 rounded-lg p-4 mb-4 max-w-md w-full"
      >
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">
          {campaign.title}
        </h3>
        <p className="text-xs text-gray-500">
          {t('common.created_at')}:{' '}
          {new Date(campaign.created_at).toLocaleString()}
        </p>

        {!campaign.active && (
          <p className="text-sm font-semibold text-red-600 mt-1 flex items-center gap-1">
            <IoIosArchive /> {t('campaign.archived')}
          </p>
        )}

        <div className="mt-3 space-y-1">
          {campaign.campaignPlaces.map((cp, i) => (
            <div key={i} className="text-sm mb-2">
              <span
                className={`px-2 py-1 rounded-md font-medium border ${
                  campaign.active
                    ? cp.status === 'SENT'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : 'bg-red-100 text-red-600 border-red-200'
                }`}
              >
                {cp.place.name} — {cp.status} ({cp.send_count ?? 0}{' '}
                {t('campaign.sends')})
              </span>
              {cp.sent_at && (
                <span className="text-xs text-gray-400 italic block mt-1">
                  {t('campaign.sent_at')}:{' '}
                  {new Date(cp.sent_at).toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {campaign.active && hasPending && (
            <button
              onClick={() => handleSend(campaign.id)}
              disabled={loadingId === campaign.id}
              className="bg-[var(--color-primary)] text-white font-medium py-2 px-4 rounded-md
                         hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 cursor-pointer
                         flex justify-center items-center gap-2"
            >
              {loadingId === campaign.id ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoIosSend />
              )}
              {t('campaign.send_now')}
            </button>
          )}

          {!hasPending && campaign.active && (
            <p className="text-green-700 font-medium flex items-center gap-2 text-sm">
              <FaCheckCircle /> {t('campaign.all_sent')}
            </p>
          )}

          <button
            onClick={() => handleToggle(campaign)}
            className="bg-[var(--color-primary)] text-white font-medium py-2 px-4 rounded-md
                       hover:bg-[var(--color-accent)] transition-colors cursor-pointer flex justify-center items-center gap-2"
          >
            {campaign.active ? t('campaign.archive') : t('campaign.reactivate')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)] py-10 px-4">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6 text-center">
        {t('campaign.my_campaigns')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('campaign.active')}</h2>
          {activeCampaigns.length === 0 ? (
            <p className="text-gray-500 text-sm">{t('campaign.no_active')}</p>
          ) : (
            activeCampaigns.map(renderCard)
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t('campaign.archived')}
          </h2>
          {archivedCampaigns.length === 0 ? (
            <p className="text-gray-500 text-sm">{t('campaign.no_archived')}</p>
          ) : (
            archivedCampaigns.map(renderCard)
          )}
        </div>
      </div>

      {snackbar?.open && (
        <Notification
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}

      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              {t('campaign.reactivate')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('campaign.confirm_reactivate')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmDialog({ open: false, campaignId: null })
                }
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md
                  hover:bg-gray-100 transition cursor-pointer"
              >
                {t('common.no')}
              </button>
              <button
                onClick={confirmToggle}
                className="bg-[var(--color-primary)] text-white font-medium py-2 px-4 rounded-md
                  hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
              >
                {t('common.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
