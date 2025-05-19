import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Place } from '../../types/Place';
import PlaceRow from './PlaceRow';

type Props = {
  places: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string) => void;
};

export default function PlaceTable({ places, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Zona</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Activo</TableCell>
          <TableCell>Acciones</TableCell>
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
