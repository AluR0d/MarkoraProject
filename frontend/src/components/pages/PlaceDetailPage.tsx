import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Place } from '../../types/Place';
import PlaceDetailEditableCard from '../molecules/PlaceDetailEditableCard';
import PlaceMap from '../molecules/PlaceMap';
import { useTranslation } from 'react-i18next';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/places/${id}`)
      .then((res) => setPlace(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <div className="text-sm text-gray-500">{t('common.loading')}...</div>
      </div>
    );

  if (!place)
    return (
      <div className="pt-20 text-center text-gray-600 font-medium">
        {t('admin.places.not_found')}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
          📍 {place.name}
        </h1>
        <button
          onClick={() => window.history.back()}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-accent)] transition text-sm font-medium cursor-pointer"
        >
          ← {t('common.back')}
        </button>
      </div>

      <PlaceDetailEditableCard place={place} onUpdate={setPlace} />
      <PlaceMap place={place} onUpdate={setPlace} />
    </div>
  );
}
