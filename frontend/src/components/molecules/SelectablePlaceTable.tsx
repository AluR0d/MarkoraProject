import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import { Place } from '../../types/Place';
import { useTranslation } from 'react-i18next'; // Import translation hook

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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle1">
          {t('selectable_place.selected_places')}: {selectedIds.length}
        </Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={() => {
                  const pageIds = places.map((p) => p.id);
                  const isPartiallySelected = places.some((p) =>
                    selectedIds.includes(p.id)
                  );
                  const isFullySelected = places.every((p) =>
                    selectedIds.includes(p.id)
                  );

                  if (isFullySelected || isPartiallySelected) {
                    onToggleSelectAll(pageIds, false);
                  } else {
                    onToggleSelectAll(pageIds, true);
                  }
                }}
              />
            </TableCell>
            <TableCell>{t('selectable_place.name')}</TableCell>
            <TableCell>{t('selectable_place.zone')}</TableCell>
            <TableCell>{t('selectable_place.rating')}</TableCell>
            <TableCell>{t('selectable_place.active')}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {places.map((place) => (
            <TableRow key={place.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(place.id)}
                  onChange={() => onToggleSelect(place.id)}
                />
              </TableCell>
              <TableCell>{place.name}</TableCell>
              <TableCell>{place.zone}</TableCell>
              <TableCell>{place.rating}</TableCell>
              <TableCell>
                {place.active ? t('common.yes') : t('common.no')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
