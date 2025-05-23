import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import { Place } from '../../types/Place';

type Props = {
  places: Place[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
};

export default function SelectablePlaceTable({
  places,
  selectedIds,
  onToggleSelect,
}: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Seleccionar</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Zona</TableCell>
          <TableCell>Puntuación</TableCell>
          <TableCell>Activo</TableCell>
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
            <TableCell>{place.active ? 'Sí' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
