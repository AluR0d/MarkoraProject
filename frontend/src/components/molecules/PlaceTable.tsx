import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Place } from '../../types/Place';
import PlaceRow from './PlaceRow';

type Props = {
  places: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string) => void;
};

export default function PlaceTable({ places, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <TableContainer>
        <Table className="min-w-full text-sm">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--color-primary)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                {t('admin.places.table_headers.id')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                {t('admin.places.table_headers.name')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                {t('admin.places.table_headers.zone')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                {t('admin.places.table_headers.rating')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                {t('admin.places.table_headers.active')}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                {t('admin.places.table_headers.actions')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {places.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                onEdit={() => onEdit(place)}
                onDelete={() => onDelete(place.id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
