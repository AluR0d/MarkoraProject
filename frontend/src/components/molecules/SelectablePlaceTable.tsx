import { Place } from '../../types/Place';
import { useTranslation } from 'react-i18next';

type Props = {
  places: Place[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[], selectAll: boolean) => void;
};

export default function SelectablePlaceTable({
  places,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: Props) {
  const { t } = useTranslation();

  const allSelected = places.every((p) => selectedIds.includes(p.id));
  const someSelected = places.some((p) => selectedIds.includes(p.id));

  const handleSelectAll = () => {
    const pageIds = places.map((p) => p.id);
    const shouldSelect = !(someSelected || allSelected);
    onToggleSelectAll(pageIds, shouldSelect);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-2 text-sm text-gray-700 font-medium">
        {t('selectable_place.selected_places')}: {selectedIds.length}
      </div>

      <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[var(--color-primary)] text-white">
          <tr>
            <th className="p-2 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected && !allSelected;
                }}
                onChange={handleSelectAll}
                className="cursor-pointer"
              />
            </th>
            <th className="p-2 text-left">{t('selectable_place.name')}</th>
            <th className="p-2 text-left">{t('selectable_place.zone')}</th>
            <th className="p-2 text-left">{t('selectable_place.rating')}</th>
            <th className="p-2 text-left">{t('selectable_place.active')}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {places.map((place) => (
            <tr key={place.id} className="hover:bg-gray-50 transition">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(place.id)}
                  onChange={() => onToggleSelect(place.id)}
                  className="cursor-pointer"
                />
              </td>
              <td className="p-2">{place.name}</td>
              <td className="p-2">{place.zone}</td>
              <td className="p-2">{place.rating}</td>
              <td className="p-2">
                {place.active ? (
                  <span className="text-green-600 font-medium">
                    {t('common.yes')}
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    {t('common.no')}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
