import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('admin.places.table_headers.id')}</TableCell>
          <TableCell>{t('admin.places.table_headers.name')}</TableCell>
          <TableCell>{t('admin.places.table_headers.zone')}</TableCell>
          <TableCell>{t('admin.places.table_headers.rating')}</TableCell>
          <TableCell>{t('admin.places.table_headers.active')}</TableCell>
          <TableCell>{t('admin.places.table_headers.actions')}</TableCell>
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
  );
}
