import { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedZone = zone.trim();
    const numericRating = rating ? Number(rating) : undefined;

    if (
      numericRating !== undefined &&
      (numericRating < 0 || numericRating > 5)
    ) {
      setError(t('admin.places.filters.rating_out_of_range'));
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

    setError(null);
  };

  const handleReset = () => {
    setName('');
    setZone('');
    setRating('');
    setActiveStatus('all');
    setRatingOrder('none');
    onFilter({});
    setError(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
        {t('admin.places.filters.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('admin.places.filters.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Zone */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('admin.places.filters.zone')}
          </label>
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('admin.places.filters.min_rating')}
          </label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Rating Order */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('admin.places.filters.rating_order')}
          </label>
          <select
            value={ratingOrder}
            onChange={(e) => setRatingOrder(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            <option value="none">{t('admin.places.filters.no_order')}</option>
            <option value="desc">
              {t('admin.places.filters.high_to_low')}
            </option>
            <option value="asc">{t('admin.places.filters.low_to_high')}</option>
          </select>
        </div>

        {/* Active */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('admin.places.filters.active')}
          </label>
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            <option value="all">{t('admin.places.filters.all')}</option>
            <option value="true">
              {t('admin.places.filters.only_active')}
            </option>
            <option value="false">
              {t('admin.places.filters.only_inactive')}
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 font-medium mt-3">{error}</div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
          onClick={handleSubmit}
        >
          {t('admin.places.filters.apply')}
        </button>
        <button
          className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleReset}
        >
          {t('admin.places.filters.clear')}
        </button>
      </div>
    </div>
  );
}
