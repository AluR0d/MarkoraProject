import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import { createCampaignSchema } from '../../schemas/createCampaignSchema';
import SelectablePlaceTable from '../../components/molecules/SelectablePlaceTable';
import PlaceFilterForm from '../../components/molecules/PlaceFilterForm';
import { PlaceService } from '../../services/placeService';
import { Place } from '../../types/Place';
import ReactQuill from 'react-quill-new';
import i18n from '../../utils/i18n';

export default function CreateCampaignPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

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
    rating?: number;
    active?: boolean;
    ratingOrder?: 'asc' | 'desc';
  }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const plainMessage = formData.message.replace(/<[^>]+>/g, '').trim();

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const query: Record<string, string> = {
          page: String(page),
          limit: String(limit),
        };

        if (filters.name) query.name = filters.name;
        if (filters.zone) query.zone = filters.zone;
        if (filters.rating !== undefined && !isNaN(filters.rating))
          query.rating = String(filters.rating);
        if (filters.active !== undefined)
          query.active = filters.active ? 'true' : 'false';
        if (filters.ratingOrder) {
          query.orderBy = 'rating';
          query.order = filters.ratingOrder;
        }

        const queryParams = new URLSearchParams(query).toString();
        const res = await PlaceService.getFiltered(queryParams);
        setPlaces(res.data);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Error al cargar lugares', err);
      }
    };

    loadPlaces();
  }, [filters, page]);

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleSubmit = async () => {
    const trimmedTitle = formData.title.trim();
    const newErrors: typeof errors = {};

    if (trimmedTitle.length === 0)
      newErrors.title = t('campaign.errors.title_required');
    if (plainMessage.length === 0)
      newErrors.message = t('campaign.errors.message_required');
    if (plainMessage.length > 200)
      newErrors.message = t('campaign.errors.message_too_long');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (selectedPlaceIds.length === 0) {
      setNotification({
        message: t('campaign.errors.no_places_selected'),
        type: 'error',
      });
      return;
    }

    try {
      createCampaignSchema.parse({
        title: trimmedTitle,
        message: plainMessage,
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns`,
        {
          title: trimmedTitle,
          message_template: formData.message,
          place_ids: selectedPlaceIds,
          frequency: frequency === 0 ? null : frequency,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (user) {
        setUser({ ...user, balance: user.balance - 5 });
      }

      setFormData({ title: '', message: '' });
      setFrequency(0);
      setSelectedPlaceIds([]);
      setErrors({});
      setNotification({
        message: t('campaign.success_message'),
        type: 'success',
      });

      setTimeout(() => setShowModal(true), 300);
    } catch (error) {
      setNotification({
        message: t('campaign.errors.create_error'),
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-white)] py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl space-y-8 relative z-40">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
            {t('campaign.create_title')}
          </h1>
          <p className="text-sm text-gray-700">
            {t('campaign.balance')}: <strong>{user?.balance ?? '...'}</strong>{' '}
            {t('common.credits')}
          </p>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {t('campaign.title_label')}
          </label>
          <input
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            maxLength={50}
          />
          <div className="text-sm text-gray-500 mt-1">
            {errors.title ? (
              <span className="text-red-500">{errors.title}</span>
            ) : (
              `${formData.title.length}/50`
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {t('campaign.message_body')}
          </label>
          <ReactQuill
            key={i18n.language}
            theme="snow"
            value={formData.message}
            onChange={(value) => setFormData({ ...formData, message: value })}
            placeholder={t('campaign.message_placeholder')}
            style={{ minHeight: '50px', marginBottom: '8px' }}
          />
          <div className="text-sm flex justify-between mt-1">
            <span className={errors.message ? 'text-red-500' : 'text-gray-500'}>
              {errors.message || ''}
            </span>
            <span className="text-gray-500">{plainMessage.length}/200</span>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {t('campaign.frequency_label')}
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)]"
            value={frequency}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setFrequency(isNaN(value) ? 0 : Math.max(0, value));
            }}
            min={0}
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('campaign.frequency_helper')}
          </p>
        </div>

        <div className="text-right">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-[var(--color-primary)] hover:underline cursor-pointer"
          >
            {showFilters
              ? t('campaign.hide_filters')
              : t('campaign.show_filters')}
          </button>
        </div>

        {showFilters && (
          <PlaceFilterForm
            onFilter={(f) => {
              setPage(1);
              setFilters(f);
            }}
          />
        )}

        <div className="bg-white p-4 rounded-md shadow-md">
          {places.length === 0 ? (
            <p className="text-center text-gray-500">
              {t('campaign.no_places_found')}
            </p>
          ) : (
            <SelectablePlaceTable
              places={places}
              selectedIds={selectedPlaceIds}
              onToggleSelect={(id) =>
                setSelectedPlaceIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
                )
              }
              onToggleSelectAll={(ids, all) =>
                setSelectedPlaceIds((prev) =>
                  all
                    ? [...new Set([...prev, ...ids])]
                    : prev.filter((id) => !ids.includes(id))
                )
              }
            />
          )}
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            className="text-sm px-3 py-1 border rounded-md cursor-pointer"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ⬅ {t('common.previous')}
          </button>
          <span className="text-sm">
            {t('common.page')} {page} {t('common.of')} {totalPages}
          </span>
          <button
            className="text-sm px-3 py-1 border rounded-md cursor-pointer"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            {t('common.next')} ➡
          </button>
        </div>

        <div className="text-right">
          <button
            className={`font-medium px-5 py-2 rounded-md transition ${
              selectedPlaceIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] cursor-pointer'
            }`}
            disabled={selectedPlaceIds.length === 0}
            onClick={handleSubmit}
          >
            {t('campaign.create_button')}
          </button>
        </div>

        {notification && (
          <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-sm font-medium z-50 flex items-center justify-between gap-4 w-fit max-w-md ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold hover:opacity-70 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Confirmación */}
        {showModal && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-semibold mb-2">
                {t('campaign.success_dialog_title')}
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                {t('campaign.success_dialog_message')}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm text-gray-700 hover:underline cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  {t('common.no')}
                </button>
                <button
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-accent)] cursor-pointer"
                  onClick={() => {
                    setShowModal(false);
                    navigate('/my-campaigns');
                  }}
                >
                  {t('common.yes')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
